import { extendType, idArg, nonNull } from 'nexus';
import { proposalsService } from '@services';

export const FinalizeProposalMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.boolean('finalizeProposal', {
      args: {
        proposalId: nonNull(idArg())
      },
      resolve: async (root, { proposalId }) => {
        await proposalsService.finalize(proposalId);

        return true;
      }
    });
  }
});