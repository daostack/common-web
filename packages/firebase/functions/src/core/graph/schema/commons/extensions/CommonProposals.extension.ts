import { arg, extendType, intArg } from 'nexus';

import { proposalDb } from '../../../../../proposals/database';

import { ProposalType } from '../../proposals/types/Proposal.type';
import { ProposalTypeEnum } from '../../proposals/enums/ProposalType.enum';
import { ProposalStateEnum } from '../../proposals/enums/ProposalState.enum';
import { ProposalPaymentStateEnum } from '../../proposals/enums/ProposalPaymentState.enum';

export const CommonProposalsExtension = extendType({
  // @todo Use Constant
  type: 'Common',
  definition(t) {
    t.list.field('proposals', {
      type: ProposalType,
      args: {
        page: intArg(),

        type: arg({
          type: ProposalTypeEnum
        }),

        state: arg({
          type: ProposalStateEnum
        }),

        paymentState: arg({
          type: ProposalPaymentStateEnum
        })
      },
      resolve: async (root, args) => {
        const proposals = await proposalDb.getMany({
          commonId: root.id,
          type: args.type,
          state: args.state,
          paymentState: args.paymentState,


          ...(args.page && ({
            last: 10,
            after: (args.page - 1) * 10,
          }))
        });

        return proposals as any;
      },
    });
  }
})