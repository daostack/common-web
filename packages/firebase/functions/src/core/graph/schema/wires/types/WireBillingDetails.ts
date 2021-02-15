import { objectType } from "nexus";

export const WireBillingDetailsType = objectType({
  name: 'WireBillingDetailsType',
  definition(t) {
    t.string('city');
    t.string('country');
    t.string('line1');
    t.string('line2');
    t.string('name');
    t.string('postalCode');
  }
})