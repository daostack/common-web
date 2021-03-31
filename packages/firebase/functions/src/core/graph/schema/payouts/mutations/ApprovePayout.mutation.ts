import { extendType, idArg, intArg, nonNull, stringArg } from 'nexus';
import { approvePayout } from '../../../../../circlepay/payouts/business/approvePayout';

// http://localhost:5003/common-staging-50741/us-central1/circlepay/payouts/approve?payoutId=d81723d6-ab40-4d26-ba2c-95d75a0197c7&index=0&token=3dda003266fdf9a55b24cf2637cd394c97a2c932874910e2278289b3c6ee345a

export const ApprovePayoutMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.boolean('approvePayout', {
      args: {
        payoutId: nonNull(idArg()),
        index: nonNull(intArg()),
        token: nonNull(stringArg())
      },

      resolve: (root, args) => {
        return approvePayout(args);
      }
    });
  }
});