import * as z from 'zod';
import { ReportAction, ReportStatus, DiscussionMessageFlag, EventType, Report } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { eventService } from '@services';
import { getUserReportActingAuthority } from '../queries/getUserReportActingAuthority';

const schema = z.object({
  reportId: z.string()
    .nonempty(),

  userId: z.string()
    .nonempty(),

  action: z.enum(Object.keys(ReportAction) as [(keyof typeof ReportAction)])
});

export const actOnReportCommand = async (payload: z.infer<typeof schema>): Promise<Report> => {
  // Validate the payload
  schema.parse(payload);

  // Find the user authority
  const authority = await getUserReportActingAuthority(payload.userId, payload.reportId);

  // Find the discussion message id
  const reportWithDiscussionAndCommonIds = await prisma.report
    .findUnique({
      where: {
        id: payload.reportId
      },
      select: {
        commonId: true,
        messageId: true
      }
    });

  logger.debug('Acting on report with {authority} authority', authority);

  // Update the message and report accordingly
  const [report, message] = await prisma.$transaction([
    prisma.report.update({
      where: {
        id: payload.reportId
      },
      data: {
        reviewedOn: new Date(),
        reviewerId: payload.userId,
        reviewAuthority: authority,

        status: ReportStatus.Clossed,
        action: payload.action
      }
    }),
    prisma.discussionMessage
      .update({
        where: {
          id: reportWithDiscussionAndCommonIds!.messageId
        },
        data: {
          flag: payload.action === ReportAction.Respected
            ? DiscussionMessageFlag.Hidden
            : DiscussionMessageFlag.Clear
        }
      })
  ]);

  logger.debug('Successfully acted on report');

  // Send events
  eventService.create({
    type: payload.action === ReportAction.Respected
      ? EventType.ReportRespected
      : EventType.ReportDismissed,
    commonId: reportWithDiscussionAndCommonIds!.commonId,
    payload: {
      reportId: report.id,
      messageId: message.id,
      actionTaken: payload.action,
      authority
    }
  });

  // Return the updated report
  return report;
};