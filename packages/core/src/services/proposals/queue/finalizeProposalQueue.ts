import Queue from 'bull';

import { Queues } from '../../../domain/constants/index';
import { finalizeProposalCommand } from '../shared/command/finalizeProposalCommand';

interface IFinalizeProposalQueueJob {
  proposalId: string;
}

export const finalizeProposalQueue = new Queue<IFinalizeProposalQueueJob>(Queues.FinalizeProposalQueue);

export const addFinalizeProposalJob = (proposalId: string): void => {
  finalizeProposalQueue.add({ proposalId });
};

finalizeProposalQueue.process(async (job, done) => {
  try {
    await finalizeProposalCommand(job.data.proposalId);
  } finally {
    done();
  }
});