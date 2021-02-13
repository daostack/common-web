import { enumType } from "nexus";

export const ProposalStateEnum = enumType({
  name: 'ProposalState',
  members: [
    'passedInsufficientBalance',
    'countdown',
    'passed',
    'failed',
  ],
});
