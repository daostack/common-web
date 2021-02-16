import { enumType } from "nexus";

export const ProposalTypeEnum = enumType({
  name: 'ProposalType',
  members: {
    fundingRequest: 'fundingRequest',
    join: 'join',
  },
});

