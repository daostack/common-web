import { mutationField, inputObjectType, nonNull, arg } from 'nexus';
import { userService } from '@common/core';

const CreateUserBillingDetailsInput = inputObjectType({
  name: 'CreateUserBillingDetailsInput',
  definition(t) {
    t.nonNull.string('name');

    t.string('line2');
    t.nonNull.string('line1');

    t.string('district');
    t.nonNull.string('city');
    t.nonNull.string('postalCode');

    t.nonNull.field('country', {
      type: 'Country'
    });
  }
});

export const CreateUserBillingDetailsMutation = mutationField('createUserBillingDetails', {
  type: 'UserBillingDetails',
  args: {
    input: nonNull(
      arg({
        type: CreateUserBillingDetailsInput
      })
    )
  },
  resolve: async (root, args, ctx) => {
    const userId = await ctx.getUserId();

    return userService.createBillingDetails({
      ...args.input,
      userId
    });
  }
});