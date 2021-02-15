import { objectType } from "nexus";

export const PayoutSecurityType = objectType({
  name: 'PayoutSecurity',
  definition(t) {
    t.int('id');

    t.int('redemptionAttempts')
    t.boolean('redeemed');
  }
})