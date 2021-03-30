import { prisma } from '@toolkits';

import { IEventsQueue } from '../definition';

export const CreateEvent = 'Common.Queue.Events.CreateEvent';

export const registerCreateEventProcessor = (queue: IEventsQueue): void => {
  queue.process(CreateEvent, async (job, done) => {
    // Create the vote in the database
    const event = await prisma.event.create({
      data: {
        type: job.data.type,
        userId: job.data.userId,
        commonId: job.data.commonId,
        payload: job.data.payload
      }
    });

    done();
  });
};