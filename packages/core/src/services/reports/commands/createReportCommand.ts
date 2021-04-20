import * as z from 'zod';
import { ReportFor, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';
import { CommonError } from '@errors';

const schema = z.object({
  reporterId: z.string()
    .nonempty(),

  messageId: z.string()
    .nonempty(),

  note: z.string()
    .nonempty(),

  for: z.enum(Object.keys(ReportFor) as [(keyof typeof ReportFor)])
});

export const createReportCommand = async (payload: z.infer<typeof schema>) => {
  // Validate the payload
  schema.parse(payload);

  // Find the ID of the common
  const commonWithId = await prisma.common.findFirst({
    where: {
      discussions: {
        some: {
          messages: {
            some: {
              id: payload.messageId
            }
          }
        }
      }
    },
    select: {
      id: true
    }
  });

  if (!commonWithId) {
    throw new CommonError(
      'Cannot create the report because we are having ' +
      'trouble locating the common of the message'
    );
  }

  // Create the report
  const report = await prisma.report.create({
    data: {
      ...payload,
      commonId: commonWithId.id
    },
    include: {
      message: {
        select: {
          discussion: {
            select: {
              commonId: true
            }
          }
        }
      }
    }
  });

  // Create the event about the report being created
  await eventService.create({
    userId: payload.reporterId,
    commonId: report.message.discussion.commonId,
    type: EventType.ReportCreated,
    payload: {
      reportedMessageId: payload.messageId,
      reportId: report.id
    }
  });

  // Return the created report
  return report;
};