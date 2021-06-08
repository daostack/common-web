import Queue from 'bull';
import { SubscriptionStatus } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';
import { Queues } from '@constants';

export interface ISubscriptionQueueJob {
  subscriptionId: string;
}

export type SubscriptionsQueueJob = 'charge';

const SubscriptionsQueue = Queue<ISubscriptionQueueJob>(Queues.SubscriptionsQueue);

export const addSubscriptionsJob = async (job: SubscriptionsQueueJob, subscriptionId: string) => {
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
    delay = new Date().getTime() + (24 * 60 * 60 * 1000); // Retry after one day
  }

  SubscriptionsQueue.add(job, {
    subscriptionId
  }, {
    delay
  });
};