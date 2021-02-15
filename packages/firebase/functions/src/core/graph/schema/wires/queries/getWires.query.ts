import { extendType, intArg } from 'nexus';
import { WireType } from '../types/Wire.type';
import { bankAccountDb } from '../../../../../circlepay/backAccounts/database';
import { NotFoundError } from '../../../../../util/errors';

export const GetWiresQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('wires', {
      type: WireType,
      args: {
        page: intArg({
          default: 1
        })
      },
      resolve: async (root, args) => {
        const bankAccounts = await bankAccountDb.getMany({
          first: 10,
          after: (args.page - 1) * 10
        });

        if (!bankAccounts.length) {
          throw new NotFoundError(`Cannot find page ${ args.page } for the current selection`);
        }

        return bankAccounts;
      }
    });
  }
});