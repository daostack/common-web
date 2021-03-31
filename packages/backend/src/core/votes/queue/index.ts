import Queue from 'bull';

import { Queues } from '@constants';

import { IVotingQueueJob } from './definition';
import { registerUpdateProposalVoteCountProcessor } from './jobs/updateProposalVoteCount';

const votingQueue = new Queue<IVotingQueueJob>(Queues.VotingQueue);

registerUpdateProposalVoteCountProcessor(votingQueue);

export { votingQueue };