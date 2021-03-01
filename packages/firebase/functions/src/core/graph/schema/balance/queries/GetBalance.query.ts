import { extendType } from 'nexus';

import { circleClient } from '../../../../../circlepay/client';

import { BalanceType } from '../types/Balance.type';

export const GetBalanceQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('balance', {
      type: BalanceType,
      resolve: async () => {
        const { data } = await circleClient.getBalance();


        return {
          available: data.available[0],
          unsettled: data.unsettled[0]
        }
      }
    });
  }
});