import { extendType } from 'nexus';
import { ProposalType } from '../../proposals/types/Proposal.type';
import { proposalDb } from '../../../../../proposals/database';


export const PayoutProposalsExtension = extendType({
  type: 'Payout',
  definition(t) {
    t.list.field('proposals', {
      type: ProposalType,
      resolve: (root) => {
        return proposalDb.getMany({
          ids: root.proposalIds
        }) as any;
      }
    });
  }
});