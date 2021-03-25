import { extendType, inputObjectType, nonNull, arg } from 'nexus';
import { votesService } from '@services';

export const CreateVoteInput = inputObjectType({
  name: 'CreateVoteInput',
  definition(t) {
    t.nonNull.field('outcome', {
      type: 'VoteOutcome'
    });

    t.nonNull.id('proposalId', {
      description:
        'The ID of the root of the proposal whether it is funding one or join'
    });
  }
});

export const CreateVoteMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createVote', {
      type: 'Vote',
      args: {
        input: nonNull(
          arg({
            type: CreateVoteInput
          })
        )
      },
      resolve: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return votesService.create({
          ...args.input,
          userId
        });
      }
    });
  }
});