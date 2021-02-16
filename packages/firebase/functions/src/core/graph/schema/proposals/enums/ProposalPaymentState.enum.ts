import { enumType } from "nexus";

export const ProposalPaymentStateEnum = enumType({
  name: 'ProposalPaymentState',
  members: [
    'notAttempted',
    'notRelevant',
    'confirmed',
    'pending',
    'failed',
  ],
});
