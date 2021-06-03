import Queue, { JobOptions } from 'bull';

import { Notification } from '@prisma/client';
import { Queues } from '@constants';


// Create the job spec

export interface INotificationsQueueJob {
  notification: Notification;
}

export type NotificationsQueueJob = 'process';

// Create the queue
export const NotificationQueue = Queue(Queues.NotificationsQueue);

// Create a way to add new job
export const addNotificationJob = (job: NotificationsQueueJob, notification: Notification, options?: JobOptions): void => {
  NotificationQueue.add(job, {
    notification
  }, {
    ...options
  });
};
