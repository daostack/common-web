import { createVoteCommand } from './commands/createVoteCommand';
import { processVoteCommand } from './commands/processVoteCommand';

import { getProposalVoteCountQuery } from './queries/getProposalVoteCountQuery';

export const voteService = {
  create: createVoteCommand,
  process: processVoteCommand,

  getVotesCount: getProposalVoteCountQuery
};