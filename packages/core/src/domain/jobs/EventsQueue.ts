import Queue, { JobOptions } from 'bull';
import { Event, EventType } from '@prisma/client';

import { Queues } from '@constants';
import { logger } from '@logger';
import { CommonError } from '@errors';

// Create the job spec

export interface IEventsQueueJob {
  create?: {
    type: EventType | string;

    userId?: string;
    commonId?: string;

    payload?: any;
  }

  process?: {
    event: Event;
  }
}

export type EventsQueueJob = 'create' | 'process';

// Create the queue
export const EventQueue = Queue(Queues.EventQueue, {
  redis: {
    host: process.env['REDIS_HOST'],
    port: Number(process.env['REDIS_PORT']),
    username: process.env['REDIS_USERNAME'],
    password: process.env['REDIS_PASSWORD']
  }
});

// Create a way to add new job
export const addEventJob = (job: EventsQueueJob, payload: IEventsQueueJob['create'] | IEventsQueueJob['process'], options?: JobOptions): void => {
  if (job === 'create') {
    logger.silly('New create event job was added');

    if (!(payload as IEventsQueueJob['create'])!.type) {
      throw new CommonError('Unsupported payload Types!');
    }

    EventQueue.add(job, {
      create: payload
    });
  }
};
