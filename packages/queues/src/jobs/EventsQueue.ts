import Queue, { JobOptions } from 'bull';
import { Event, EventType } from '@prisma/client';

import { Queues } from '../constants/Queues';
import { logger, CommonError } from '@common/core';

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

export type EventsQueueJob = 'create' | 'handle';

// Create the queue
export const EventQueue = Queue(Queues.EventQueue);

// Create a way to add new job
export const addEventJob = (job: EventsQueueJob, payload: IEventsQueueJob['create'] | IEventsQueueJob['process'], options?: JobOptions): void => {
  if (job === 'create') {
    if (!(payload as IEventsQueueJob['create'])!.type) {
      throw new CommonError('Unsupported payload type!');
    }

    EventQueue.add(job, {
      create: payload
    });
  } else if (job === 'handle') {
    logger.error('Not implemented');
  }
};
