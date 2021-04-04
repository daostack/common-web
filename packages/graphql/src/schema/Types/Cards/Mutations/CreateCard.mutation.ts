import { arg, extendType, inputObjectType, nonNull } from 'nexus';
import { cardsService } from '../../../../../../core/src/services';

export const CreateCardInput = inputObjectType({
  name: 'CreateCardInput',
  definition(t) {
    // t.nonNull.string('name', {
    //   description: 'Both the first and last name of the user, separated by space'
    // });

    t.nonNull.string('keyId', {
      description: 'The ID of the key used for the encryption of the sensitive data'
    });

    t.nonNull.string('encryptedData', {
      description: 'The sensitive part of the card as encrypted card'
    });

    t.nonNull.int('expYear');
    t.nonNull.int('expMonth');

    t.nonNull.field('billingDetails', {
      type: 'BillingDetailsInput'
    });
  }
});

export const CreateCardMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createCard', {
      type: 'Card',
      args: {
        input: nonNull(
          arg({
            type: CreateCardInput
          })
        )
      },
      resolve: async (root, args, ctx) => {
        const userId = await ctx.getUserId();

        return cardsService.create({
          ...args.input,
          ipAddress: ctx.req.clientIp as string,
          userId
        });
      }
    });
  }
});