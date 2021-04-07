import Queue from 'bull';
import { Proposal } from '@prisma/client';

import { Queues } from '@constants';
import { addFinalizeProposalJob } from './finalizeProposalQueue';


export const expireProposalsQueue = new Queue<{
  proposalId: string
}>(Queues.ExpireProposalsQueue);

export const addExpireProposalJob = (proposal: Proposal): void => {
  expireProposalsQueue.add({
    proposalId: proposal.id
  }, {
    delay: Math.abs((new Date()).getTime() - proposal.expiresAt.getTime())
  });
};

expireProposalsQueue.process(async (job, done) => {
  addFinalizeProposalJob(job.data.proposalId);

  done();
});