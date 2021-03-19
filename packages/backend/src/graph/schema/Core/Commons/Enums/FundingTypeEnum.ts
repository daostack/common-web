import { enumType } from 'nexus';
import { FundingType } from '@prisma/client';

export const FundingTypeEnum = enumType({
  name: 'FundingType',
  description: 'The funding type of the common',
  members: FundingType
});