import { arg, extendType, nonNull } from 'nexus';

import { IRequestContext } from '../../../..';
import { IntentionType } from '../type/Inetention.type';
import { CreateIntentionInput } from '../inputs/CreateIntention.input';
import { intentionDb } from '../../../../domain/intentions';

export const CreateIntentionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createIntention', {
      type: IntentionType,
      args: {
        input: nonNull(
          arg({
            type: CreateIntentionInput
          })
        )
      },
      resolve: async (root, args, ctx: IRequestContext) => {
        const { type, intention } = args.input;
        const userId = await ctx.getUserId();

        return intentionDb.add({
          type,
          userId,
          intention
        });
      }
    });
  }
});