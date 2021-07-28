// import { Kind } from 'graphql';
// import { scalarType } from 'nexus';
//
// export const DateScalar = scalarType({
//   name: 'Date',
//   asNexusMethod: 'date',
//
//   parseValue(value) {
//     return new Date(value);
//   },
//
//   serialize(value) {
//     if (!(value instanceof Date)) {
//       value = new Date(value);
//     }
//
//     return value?.getTime();
//   },
//
//   parseLiteral(ast) {
//     if (ast.kind === Kind.INT) {
//       return new Date(ast.value);
//     }
//
//     return null;
//   }
// });

import { asNexusMethod } from 'nexus';
import { GraphQLDateTime } from 'graphql-scalars';

export const DateScalar = asNexusMethod(GraphQLDateTime, 'date');