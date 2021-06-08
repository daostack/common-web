import { logger, notificationService } from '@common/core';
import { Queues } from '../queues';

// Process the jobs
Queues.NotificationsQueue.process((job, done) => {
  logger.error('Unnamed payment job occurred', {
    job
  });

  done();
});

Queues.NotificationsQueue.process('process', async (job, done) => {
  logger.debug('Starting processing of the notification');

  job.progress(3);

  const { notification } = job.data;

  await notificationService.process(notification.id);

  job.progress(100);

  done();
});
