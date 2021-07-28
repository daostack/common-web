import * as z from 'zod';
import { ReportFlag, ReportFor, ReportType, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';
import { CommonError } from '@errors';

const schema = z.object({
  reporterId: z.string()
    .nonempty(),

  messageId: z.string()
    .optional(),

  proposalId: z.string()
    .optional(),

  note: z.string()
    .nonempty(),

  for: z.enum(Object.keys(ReportFor) as [(keyof typeof ReportFor)]),
  type: z.enum(Object.keys(ReportType) as [(keyof typeof ReportType)])
});

export const createReportCommand = async (payload: z.infer<typeof schema>) => {
  // Validate the payload
  schema.parse(payload);

  // Find the ID of the common
  const commonWithId = await prisma.common.findFirst({
    where: {
      OR: [{
        discussions: {
          some: {
            messages: {
              some: {
                id: payload.messageId
              }
            }
          }
        }
      }, {
        proposals: {
          some: {
            id: payload.proposalId
          }
        }
      }]
    },
    select: {
      id: true
    }
  });

  if (!commonWithId) {
    throw new CommonError(
      'Cannot create the report because we are having ' +
      'trouble locating the common of the message or proposal'
    );
  }


  // Create the report and mark the message as reported in transaction
  const [report] = await prisma.$transaction([
    // Crate the report
    prisma.report.create({
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
    }),

    payload.type === ReportType.ProposalReport
      // Mark the proposal as reported
      ? prisma.proposal.update({
        where: {
          id: payload.proposalId
        },
        data: {
          flag: ReportFlag.Reported
        },
        select: {
          id: true
        }
      })
      // Mark the message as reported
      : prisma.discussionMessage.update({
        where: {
          id: payload.messageId
        },
        data: {
          flag: ReportFlag.Reported
        },
        select: {
          id: true
        }
      })
  ]);

  // Create the event about the report being created
  await eventService.create({
    userId: payload.reporterId,
    commonId: commonWithId.id,
    type: EventType.ReportCreated,
    payload: {
      reportedMessageId: payload.messageId,
      reportedProposalId: payload.proposalId,
      reportId: report.id
    }
  });

  // Return the created report
  return report;
};