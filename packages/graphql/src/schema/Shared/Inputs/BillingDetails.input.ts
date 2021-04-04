import { inputObjectType } from 'nexus';

export const BillingDetailsInput = inputObjectType({
  name: 'BillingDetailsInput',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('city');
    t.nonNull.string('country');
    t.nonNull.string('line1');
    t.nonNull.string('postalCode');

    t.string('line2');
    t.string('district');
  }
});
