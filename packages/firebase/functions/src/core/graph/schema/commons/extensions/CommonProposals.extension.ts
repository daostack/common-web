import { extendType, intArg } from 'nexus';
import { ProposalType } from '../../proposals';
import { proposalDb } from '../../../../../proposals/database';

export const CommonProposalsExtension = extendType({
  // @todo Use Constant
  type: 'Common',
  definition(t) {
    t.list.field('proposals', {
      type: ProposalType,
      args: {
        page: intArg({
          default: 1,
        }),
      },
      resolve: async (root, args) => {
        const proposals = await proposalDb.getMany({
          commonId: root.id,

          last: 10,
          after: (args.page - 1) * 10,
        });

        return proposals as any;
      },
    });
  }
})