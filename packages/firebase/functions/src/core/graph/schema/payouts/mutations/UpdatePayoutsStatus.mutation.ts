import { extendType } from 'nexus';
import { updatePayoutsStatus } from '../../../../../circlepay/payouts/business/updatePayoutsStatus';

export const UpdatePayoutsStatusMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('updatePayoutsStatus', {
      resolve: async () => {
        await updatePayoutsStatus();

        return true;
      }
    });
  }
});