import { arg, extendType, inputObjectType, nonNull } from 'nexus';
import { joinProposalService } from '@services';

export const CreateJoinProposalInput = inputObjectType({
  name: 'CreateJoinProposalInput',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('description');

    t.nonNull.int('fundingAmount');

    t.nonNull.string('cardId');
    t.nonNull.string('commonId');

    t.list.nonNull.field('links', {
      type: 'LinkInput'
    });
  }
});

export const CreateJoinProposalMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createJoinProposal', {
      type: 'JoinProposal',
      description: 'Create new proposal of type JOIN.',
      args: {
        input: nonNull(
          arg({
            type: CreateJoinProposalInput
          })
        )
      },
      resolve: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return joinProposalService.commands.create({
          ...args.input,
          userId
        });
      }
    });
  }
});