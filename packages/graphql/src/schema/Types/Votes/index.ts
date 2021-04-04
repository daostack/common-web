import { VoteType } from './Types/Vote.type';

import { VoteOutcomeEnum } from './Enums/VoteOutcome.enum';

import { CreateVoteInput, CreateVoteMutation } from './Mutations/CreateVote.mutation';

export const VoteTypes = [
  VoteType,

  VoteOutcomeEnum,

  CreateVoteInput,
  CreateVoteMutation
];