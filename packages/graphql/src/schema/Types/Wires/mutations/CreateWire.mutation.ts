import { mutationField, inputObjectType, nonNull, arg } from 'nexus';

import { authorizationService, wireService } from '@common/core';

const CreateWireInput = inputObjectType({
  name: 'CreateWireInput',
  definition(t) {
    t.string('iban');
    t.string('accountNumber');
    t.string('routingNumber');

    t.nonNull.string('userId');
    t.nonNull.string('billingDetailsId');
    t.nonNull.string('wireBankDetailsId');
  }
});

export const CreateWireMutation = mutationField('createWire', {
  type: 'Wire',
  args: {
    input: nonNull(
      arg({
        type: CreateWireInput
      })
    )
  },
  authorize: async (root, args, ctx) => {
    return authorizationService.can(await ctx.getUserId(), 'admin.wire.create');
  },
  resolve: (root, args) => {
    return wireService.create(args.input);
  }
});