import { enumType } from 'nexus';

export const ProposalFundingStateEnum = enumType({
  name: 'ProposalFundingState',
  members: [
    'notRelevant',
    'notAvailable',
    'available',
    'funded'
  ]
});