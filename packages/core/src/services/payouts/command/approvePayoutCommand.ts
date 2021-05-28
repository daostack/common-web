import { EventType, PayoutApprover, PayoutApproverResponse } from '@prisma/client';
import * as z from 'zod';
import { logger } from '@logger';
import { prisma } from '@toolkits';
import { eventService } from '@services';

const schema = z.object({
  userId: z.string(),
  payoutId: z.string(),

  outcome: z.enum(Object.keys(PayoutApproverResponse) as [(keyof typeof PayoutApproverResponse)])
});

export const approvePayoutCommand = async (command: z.infer<typeof schema>): Promise<PayoutApprover> => {
  schema.parse(command);

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
      // @todo Execute the payout
    }
  }

  return approver;
};