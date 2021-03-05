import { extendType } from "nexus";
import { addCommonIdToPaymentMigration } from '../../../../../circlepay/payments/migrations/addCommonIdToPaymentMigration';

export const UpdatePaymentsCommonIdMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('updatePaymentsCommonId', {
      resolve: async () => {
        await addCommonIdToPaymentMigration();

        return true;
      }
    })
  }
})
