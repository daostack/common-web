import Queue from 'bull';

import { Queues } from '@constants';

interface IProposalQueueJob {
  proposalId: string;
}

export const proposalsQueue = new Queue<IProposalQueueJob>(Queues.ProposalsQueue);

