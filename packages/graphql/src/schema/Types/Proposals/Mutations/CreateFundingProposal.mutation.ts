import { arg, extendType, inputObjectType, nonNull } from 'nexus';
import { proposalsService } from '../../../../../../core/src/services';

export const CreateFundingProposalInput = inputObjectType({
  name: 'CreateFundingProposalInput',
  definition(t) {
    t.nonNull.id('commonId');

    t.nonNull.int('amount');

    t.nonNull.string('title');
    t.nonNull.string('description');

    t.list.nonNull.field('links', {
      type: 'ProposalLinkInput'
    });

    t.list.nonNull.field('files', {
      type: 'ProposalFileInput'
    });

    t.list.nonNull.field('images', {
      type: 'ProposalImageInput'
    });
  }
});

export const CreateFundingProposalMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createFundingProposal', {
      type: 'FundingProposal',
      args: {
        input: nonNull(
          arg({
            type: CreateFundingProposalInput
          })
        )
      },
      resolve: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return proposalsService.funding.create({
          ...args.input,
          proposerId: userId
        });
      }
    });
  }
});