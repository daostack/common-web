import { extendType } from 'nexus';
import { proposalDb } from '../../../../../proposals/database';
import { commonDb } from '../../../../../common/database';

export const PaymentCommonExtensions = extendType({
  type: 'Payment',
  definition(t) {
    t.field('common', {
      type: 'Common',
      resolve: async (root) => {
        const proposal = await proposalDb.getProposal(root.proposalId);

        return commonDb.get(proposal.commonId)
      }
    })
  }
})