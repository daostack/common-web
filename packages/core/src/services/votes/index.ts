import { createVoteCommand } from './commands/createVoteCommand';
import { getProposalVoteCountQuery } from 'packages/core/src/services/votes/queries/getProposalVoteCountQuery';

export const votesService = {
  create: createVoteCommand,

  getVotesCount: getProposalVoteCountQuery
};