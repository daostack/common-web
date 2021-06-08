import { objectType } from 'nexus';

export const UserBillingDetailsType = objectType({
  name: 'UserBillingDetails',
  definition(t) {
    t.implements('BaseEntity');
    t.implements('Address');

    t.nonNull.string('name');
  }
});