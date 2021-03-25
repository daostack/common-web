import Queue from 'bull';

import { Queues } from '@constants';

import { IVotingQueueJob } from './definition';
import { registerUpdateProposalVoteCountProcessor } from './jobs/updateProposalVoteCount';

const VotingQueue = new Queue<IVotingQueueJob>(Queues.VotingQueue);

registerUpdateProposalVoteCountProcessor(VotingQueue);

export { VotingQueue };