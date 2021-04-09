import { enumType } from 'nexus';
import { ProposalType } from '@prisma/client';

export const ProposalTypeEnum = enumType({
  name: 'ProposalType',
  members: ProposalType
});