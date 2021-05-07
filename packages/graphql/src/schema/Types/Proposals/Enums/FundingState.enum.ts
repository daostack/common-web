import { enumType } from 'nexus';
import { FundingState } from '@prisma/client';


export const FundingStateEnum = enumType({
  name: 'FundingState',
  members: FundingState
});