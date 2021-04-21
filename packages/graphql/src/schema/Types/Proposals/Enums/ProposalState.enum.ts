import { enumType } from 'nexus';
import { ProposalState } from '@prisma/client';

export const ProposalStateEnum = enumType({
  name: 'ProposalState',
  members: ProposalState
});