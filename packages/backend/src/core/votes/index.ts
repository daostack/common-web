import { createVoteCommand } from './commands/createVoteCommand';
import { getProposalVoteCountQuery } from '@votes/queries/getProposalVoteCountQuery';

export const votesService = {
  create: createVoteCommand,

  getVotesCount: getProposalVoteCountQuery
};