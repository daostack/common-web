import { Payout, PayoutApproverResponse, PayoutStatus, EventType } from '@prisma/client';

import { worker } from '@jobs';

import { NotFoundError, CommonError } from '@errors';
import { eventService } from '@services';
import { circleClient } from '@clients';
import { prisma } from '@toolkits';


export const executePayoutCommand = async (payoutId: string): Promise<Payout> => {
  // Find the payout and all of its approvers
  const payoutWithApprovers = await prisma.payout
    .findUnique({
      where: {
        id: payoutId
      },
      include: {
        approvers: true,
        wire: {
          include: {
            user: true
          }
        }
      }
    });

  if (!payoutWithApprovers) {
    throw new NotFoundError('executePayout.payout.id', payoutId);
  }

  // Check if the payout has the needed approvals
  const neededApprovers = Number(process.env['Payout.RequiredApprovals'] || 2);
  const collectedApprovals = payoutWithApprovers.approvers.map(x => x.outcome === PayoutApproverResponse.Approved).length;

  if (collectedApprovals < neededApprovers) {
    throw new CommonError('[ExecutePayout] Cannot execute the payout because it does not have enough approvals');
  }

  // If the payout has approvals create the payout in circle and mark it as executed
  const { wire } = payoutWithApprovers;

  const circlePayout = await circleClient.payouts.create({
    idempotencyKey: payoutWithApprovers.id,
    amount: {
      currency: 'USD',
      amount: (payoutWithApprovers.amount / 100)
    },
    destination: {
      id: wire.circleId,
      type: 'wire'
    },
    metadata: {
      beneficiaryEmail: wire.user.email
    }
  });

  // Link the payout in circle locally
  const linkedPayout = await prisma.payout
    .update({
      where: {
        id: payoutId
      },
      data: {
        circlePayoutId: circlePayout.data.id,
        status: PayoutStatus.CirclePending
      }
    });

  // Schedule cron job to check for payout details update
  worker.addPayoutJob('update', payoutId);

  // Create event
  eventService.create({
    type: EventType.PayoutExecuted,
    payload: {
      payout: linkedPayout
    }
  });

  // Return the updated payout
  return linkedPayout;
};