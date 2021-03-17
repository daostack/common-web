import { enumType } from 'nexus';
import { CommonFundingType } from '@prisma/client';

export const CommonFundingTypeEnum = enumType({
  name: 'CommonFundingType',
  description: 'The funding type of the common',
  members: CommonFundingType
});