import { subscriptionField, nonNull, idArg } from 'nexus';
import { Proposal } from '@prisma/client';

import { pubSub } from '@common/core';

export const ProposalChangeSubscription = subscriptionField('onProposalChange', {
  type: 'Proposal',
  args: {
    proposalId: nonNull(idArg({
      description: 'The ID of the proposal that you wish to subscribe to'
    }))
  },
  subscribe(root, args) {
    return pubSub.asyncIterator<Proposal>(`Proposal.${args.proposalId}.Updated`);
  },
  resolve: (root: Proposal) => {
    return root;
  }
});