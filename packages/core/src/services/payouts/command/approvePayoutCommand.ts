import { EventType, PayoutApprover, PayoutApproverResponse, PayoutStatus } from '@prisma/client';
import * as z from 'zod';

import { worker } from '@jobs';
import { logger } from '@logger';
import { prisma } from '@toolkits';
import { eventService } from '@services';
import { CommonError, NotFoundError } from '@errors';

const schema = z.object({
  userId: z.string(),
  payoutId: z.string(),

  outcome: z.enum(Object.keys(PayoutApproverResponse) as [(keyof typeof PayoutApproverResponse)])
});

export const approvePayoutCommand = async (command: z.infer<typeof schema>): Promise<PayoutApprover> => {
  schema.parse(command);

  // Find the approver and the payout
  const payout = await prisma.payout
    .findUnique({
      where: {
        id: command.payoutId
      },
      include: {
        approvers: {
          where: {
            userId: command.userId
          }
        }
      }
    });

  if (!payout) {
    throw new NotFoundError('approvePayoutCommand.payout.id', command.payoutId);
  }

  // Check if the user has already laid response
  if (payout.approvers[0].outcome !== PayoutApproverResponse.Pending) {
    throw new CommonError('Cannot approve one payout more than once');
  }

  // Check the status of the payout
  if (payout.status !== PayoutStatus.PendingApproval) {
    throw new CommonError('Cannot approve payout that is not pending approval');
  }

  logger.info(`Acting on payout with outcome ${command.outcome}`);

  // Update the payout approver
  const approver = await prisma.payoutApprover
    .update({
      where: {
        userId_payoutId: {
          userId: command.userId,
          payoutId: command.payoutId
        }
      },
      data: {
        outcome: command.outcome
      }
    });

  // Create event
  eventService.create({
    type: command.outcome === PayoutApproverResponse.Approved
      ? EventType.PayoutApprovalGiven
      : EventType.PayoutRejectionGiven,

    userId: command.userId,

    payload: {
      payoutId: command.payoutId
    }
  });


  // Check if we have the required approvals
  if (command.outcome === PayoutApproverResponse.Approved) {
    const approvals = await prisma.payoutApprover
      .count({
        where: {
          outcome: PayoutApproverResponse.Approved,
          payoutId: command.payoutId
        }
      });


    if (approvals >= Number(process.env['Payout.RequiredApprovals'] || 2)) {
      // Schedule payout execution
      worker.addPayoutJob('execute', command.payoutId);
    }
  }

  return approver;
};