import { Payout, PayoutStatus, EventType } from '@prisma/client';

import { eventService } from '@services';
import { NotFoundError } from '@errors';
import { circleClient } from '@clients';
import { prisma } from '@toolkits';
import { logger } from '@logger';
import { worker } from '@common/queues';


export const updatePayoutStatusCommand = async (payoutId: string): Promise<Payout> => {
  // Find the payout
  let payout = await prisma.payout
    .findUnique({
      where: {
        id: payoutId
      }
    });

  if (!payout) {
    throw new NotFoundError('updatePayoutStatus.payout.id', payoutId);
  }

  // Check the payout status
  if (payout.status !== PayoutStatus.CirclePending) {
    logger.warn('Cannot update payouts that are not in `CirclePending` status', {
      payout
    });

    return payout;
  }

  // Get the payout from circle
  const { data: circlePayout } = await circleClient.payouts.get(payout.circlePayoutId!);
  const status = circlePayout.status === 'complete'
    ? PayoutStatus.CircleComplete
    : circlePayout.status === 'failed'
      ? PayoutStatus.CircleFailed
      : null;

  if (status) {
    logger.info('Payout state updated');

    const updatePayout = await prisma.payout.update({
      where: {
        id: payoutId
      },
      data: {
        status
      }
    });

    eventService.create({
      type: EventType.PayoutCompleted,
      payload: {
        status
      }
    });

    return updatePayout;
  } else {
    logger.debug('Payout is still pending. Creating new update status job');

    worker.addPayoutJob('update', payoutId);
  }

  return payout;
};