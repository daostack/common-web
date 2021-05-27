import { objectType } from 'nexus';

export const UserBillingDetailsType = objectType({
  name: 'UserBillingDetails',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.string('name');

    t.nonNull.string('line1');
    t.string('line2');

    t.nonNull.string('city');
    t.nonNull.string('country');
    t.nonNull.string('postalCode');
    t.string('district');
  }
});