import { objectType } from "nexus";

export const CardBillingDetailsType = objectType({
  name: 'CardBillingDetails',
  definition(t) {
    t.string('name');
    t.string('city');
    t.string('country');
    t.string('postalCode');
    t.string('district');
    t.string('line1');
  }
})