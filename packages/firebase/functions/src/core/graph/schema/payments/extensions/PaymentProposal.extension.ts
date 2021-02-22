import { extendType } from 'nexus';

import { ProposalType } from '../../proposals/types/Proposal.type';

import { proposalDb } from '../../../../../proposals/database';

export const PaymentProposalExtension = extendType({
  type: 'Payment',
  definition(t) {
    t.field('proposal', {
      type: ProposalType,
      resolve: (root) => {
        return proposalDb.getProposal(root.proposalId);
      }
    });
  }
});