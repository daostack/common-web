import * as z from 'zod';
import { ReportAction, ReportStatus, ReportFlag, EventType, Report } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { eventService } from '@services';
import { getUserReportActingAuthority } from '../queries/getUserReportActingAuthority';
import { NotFoundError } from '@errors';

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
        messageId: true,
        proposalId: true
      }
    });

  logger.debug('Acting on report with {authority} authority', authority);

  if (!reportWithDiscussionAndCommonIds) {
    throw new NotFoundError('actOnReport.report.id', payload.reportId);
  }

  // Update the message and report accordingly
  const report = await prisma.report.update({
    where: {
      id: payload.reportId
    },
    data: {
      reviewedOn: new Date(),
      reviewerId: payload.userId,
      reviewAuthority: authority,

      status: ReportStatus.Closed,
      action: payload.action
    }
  });

  const item = reportWithDiscussionAndCommonIds.messageId
    ? await prisma.discussionMessage
      .update({
        where: {
          id: reportWithDiscussionAndCommonIds.messageId!
        },
        data: {
          flag: payload.action === ReportAction.Respected
            ? ReportFlag.Hidden
            : ReportFlag.Clear
        }
      })
    : await prisma.proposal
      .update({
        where: {
          id: reportWithDiscussionAndCommonIds.proposalId!
        },
        data: {
          flag: payload.action === ReportAction.Respected
            ? ReportFlag.Hidden
            : ReportFlag.Clear
        }
      });

  logger.debug('Successfully acted on report');

  // Send events
  eventService.create({
    type: payload.action === ReportAction.Respected
      ? EventType.ReportRespected
      : EventType.ReportDismissed,
    commonId: reportWithDiscussionAndCommonIds!.commonId,
    payload: {
      reportId: report.id,
      itemId: item.id,
      actionTaken: payload.action,
      authority
    }
  });

  // Return the updated report
  return report;
};