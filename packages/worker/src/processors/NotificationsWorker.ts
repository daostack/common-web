import { Queues } from '@common/queues';
import { logger } from '@common/core';
import { notificationService } from '@common/core/dist/services';

// Process the jobs
Queues.NotificationQueue.process((job, done) => {
  logger.error('Unnamed payment job occurred', {
    job
  });

  done();
});

Queues.NotificationQueue.process('process', async (job, done) => {
  logger.debug('Starting processing of the notification');

  job.progress(3);

  const { notification } = job.data;

  await notificationService.process(notification.id);

  job.progress(100);

  done();
});
