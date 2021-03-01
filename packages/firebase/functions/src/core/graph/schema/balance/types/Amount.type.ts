import { objectType } from "nexus";

export const AmountType = objectType({
  name: 'Amount',
  definition(t) {
    t.string("amount");
    t.string("currency");
  }
})