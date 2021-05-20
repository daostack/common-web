import { inputObjectType } from 'nexus';

export const PaymentsWhereInput = inputObjectType({
  name: 'PaymentsWhereInput',
  definition(t) {
    t.uuid('commonId');
    t.uuid('userId');
  }
});