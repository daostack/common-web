import { Queue } from 'bull';
import { Vote } from '@prisma/client';

export interface IVotingQueueJob {
  vote: Vote;
}

export type IVotingQueue = Queue<IVotingQueueJob>;