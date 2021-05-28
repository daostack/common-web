import { setQueues, BullAdapter } from 'bull-board';

import { Queues } from '@common/queues';
import { eventService, logger } from '@common/core';

// Setup the queue UI
setQueues([
  new BullAdapter(Queues.EventQueue)
]);

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

    done(null, event);
  } catch (e) {
    done(e);
  }
});