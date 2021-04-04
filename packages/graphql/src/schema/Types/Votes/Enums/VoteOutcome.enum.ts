import { VoteOutcome } from '@prisma/client';
import { enumType } from 'nexus';

export const VoteOutcomeEnum = enumType({
  name: 'VoteOutcome',
  members: VoteOutcome
});