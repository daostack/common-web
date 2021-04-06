import Queue from 'bull';
import { SubscriptionStatus } from '@prisma/client';

import { Queues } from '@constants';
import { prisma } from '@toolkits';

import { createSubscriptionPaymentCommand } from '../../payments/commands/createSubscriptionPaymentCommand';
import { logger } from '@utils/logger';

interface IChargeSubscriptionQueue {
  subscriptionId: string;
}

export const chargeSubscriptionQueue = Queue<IChargeSubscriptionQueue>(Queues.ChargeSubscriptionQueue);

export const scheduleSubscriptionCharge = async (subscriptionId: string) => {
  const subscription = (await prisma.subscription.findUnique({
    where: {
      id: subscriptionId
    }
  }))!;

  let delay: number = 0;

  logger.info('time', new Date().getTime() - subscription.dueDate.getTime());

  if (subscription.status === SubscriptionStatus.Active) {
    delay = (subscription.dueDate.getTime() - new Date().getTime()) + (60 * 1000); // One minute after the due date
  } else if (subscription.status === SubscriptionStatus.PaymentFailed) {
    delay = new Date().getTime() + (24 * 60 * 60 * 1000) // Retry after one day
  }

  chargeSubscriptionQueue.add({
    subscriptionId
  }, {
    delay
  });
};

chargeSubscriptionQueue.process(async (job, done) => {
  await createSubscriptionPaymentCommand(job.data.subscriptionId);

  done();
});