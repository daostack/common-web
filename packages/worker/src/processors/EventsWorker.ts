import { eventService, logger } from '@common/core';
import { Queues } from '../queues';
import { eventHandlers } from '../events';

// Process the jobs
Queues.EventQueue.process('create', async (job, done) => {
  // @todo Create log about the processing result
  logger.debug('Starting create event job', { job });

  try {
    const event = await eventService.$create(job.data.create);

    logger.debug('Successfully created event. Starting processing', {
      job,
      event
    });

    // Process the event
    await eventService.process(event);

    logger.debug('Successfully processed event.', {
      job,
      event
    });

    // Process the handlers
    await Promise.all(eventHandlers.map((handler) => {
      return (async () => {
        try {
          await handler(job.data, event);
        } catch (e) {
          logger.error('Error occurred processing event handler!', {
            error: e,
            handler
          });
        }
      })();
    }));

    done(null, event);
  } catch (e) {
    done(e);
  }
});