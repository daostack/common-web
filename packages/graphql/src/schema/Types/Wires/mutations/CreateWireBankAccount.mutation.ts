import { mutationField, inputObjectType, nonNull, arg } from 'nexus';
import { wireService, authorizationService } from '@common/core';

const CreateWireBankAccountInput = inputObjectType({
  name: 'CreateWireBankAccountInput',
  definition(t) {
    t.nonNull.string('bankName');

    t.string('line1');
    t.string('line2');

    t.string('district');
    t.nonNull.string('city');
    t.nonNull.string('postalCode');

    t.nonNull.field('country', {
      type: 'Country'
    });
  }
});

export const CreateWireBankAccountMutation = mutationField('createWireBankAccount', {
  type: 'WireBankAccount',
  args: {
    input: nonNull(
      arg({
        type: CreateWireBankAccountInput
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.wire.bank.create');
  },
  resolve: (root, args) => {
    return wireService.createWireBankDetails(args.input);
  }
});