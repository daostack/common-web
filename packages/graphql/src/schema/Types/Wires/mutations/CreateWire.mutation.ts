import { mutationField, inputObjectType, nonNull, arg } from 'nexus';

import { authorizationService, wireService, CommonError, userService } from '@common/core';

const CreateWireInput = inputObjectType({
  name: 'CreateWireInput',
  definition(t) {
    t.string('iban');
    t.string('accountNumber');
    t.string('routingNumber');

    t.nonNull.string('userId');

    t.string('billingDetailsId');
    t.field('createBillingDetails', {
      type: 'CreateUserBillingDetailsInput'
    });

    t.string('wireBankDetailsId');
    t.field('createWireBankDetails', {
      type: 'CreateWireBankAccountInput'
    });
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
  resolve: async (root, { input }) => {
    let wireBankDetailsId = input.wireBankDetailsId;
    let billingDetailsId = input.billingDetailsId;

    try {
      if (!wireBankDetailsId) {
        if (!input.createWireBankDetails) {
          throw new CommonError('Either the ID of already created wire bank details or the payload to create new one is required!');
        }

        wireBankDetailsId = (await wireService.createWireBankDetails(input.createWireBankDetails)).id;
      }

      if (!billingDetailsId) {
        if (!input.createBillingDetails) {
          throw new CommonError('Either the ID of already created billing details or the payload to create new one is required!');
        }

        billingDetailsId = (await userService.createBillingDetails({
          ...input.createBillingDetails,
          userId: input.userId
        })).id;
      }

      return wireService.create({
        accountNumber: input.accountNumber,
        routingNumber: input.routingNumber,
        userId: input.userId,
        iban: input.iban,
        billingDetailsId,
        wireBankDetailsId
      });
    } catch (e) {
      if (wireBankDetailsId && !input.wireBankDetailsId) {

      }

      if (billingDetailsId && !input.billingDetailsId) {

      }

      throw e;
    }
  }
});