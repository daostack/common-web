import { Kind } from "graphql";
import { scalarType } from "nexus";

export const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',

  parseValue(value) {
    return new Date(value);
  },

  serialize(value) {
    if (!(value instanceof Date)) {
      if (typeof value.toDate === 'function') {
        value = value.toDate();
      } else {
        value = new Date(value);
      }
    }

    return value?.getTime();
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }

    return null;
  },
});