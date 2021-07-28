import { createVoteCommand } from './commands/createVoteCommand';
import { processVoteCommand } from './commands/processVoteCommand';

import { getProposalVoteCountQuery } from './queries/getProposalVoteCountQuery';
import { canVoteOnProposalQuery } from './queries/canVoteOnProposalQuery';

export const voteService = {
  create: createVoteCommand,
  process: processVoteCommand,

  getVotesCount: getProposalVoteCountQuery,
  canVote: canVoteOnProposalQuery
};