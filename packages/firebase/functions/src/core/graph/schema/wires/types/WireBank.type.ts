import { objectType } from "nexus";

export const WireBankType = objectType({
  name: 'WireBank',
  definition(t) {
    t.string('bankName');
    t.string('city');
    t.string('country');
  }
})