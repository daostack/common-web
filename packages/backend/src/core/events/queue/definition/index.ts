import { Queue } from 'bull';
import { EventType } from '@prisma/client';

export interface IEventsQueueJob {
  userId?: string;
  commonId?: string;
  type: EventType;
  payload?: string | null;
}

export type IEventsQueue = Queue<IEventsQueueJob>;