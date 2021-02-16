import { extendType, idArg, nonNull } from 'nexus';

import { proposalDb } from '../../../../../proposals/database';
import { ProposalType } from '../types/Proposal.type';

export const GetProposalQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('proposal', {
      type: ProposalType,
      args: {
        id: nonNull(
          idArg()
        )
      },
      resolve: (root, args) => {
        return proposalDb.getProposal(args.id) as any;
      }
    });
  }
});