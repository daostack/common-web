import { objectType } from 'nexus';

export const WireBankAccountType = objectType({
  name: 'WireBankAccount',
  definition(t) {
    t.implements('BaseEntity');
    t.implements('Address');

    t.nonNull.string('bankName');
  }
});