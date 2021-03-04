import { objectType } from "nexus";

export const CardVerificationType = objectType({
  name: 'CardVerification',
  definition(t) {
    t.string('cvv');
  }
})