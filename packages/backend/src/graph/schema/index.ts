import path from 'path';
import { makeSchema } from 'nexus';

import { UserTypes } from './Users';
import { CommonTypes } from './Commons';

import { DateScalar } from '../scalars/Date.scalar';

const types = [
  UserTypes,
  CommonTypes,

  // Scalars
  DateScalar
];

export const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(__dirname, '../generated/', 'nexus-typegen.ts'),
    schema: path.join(__dirname, '../generated/', 'schema.graphql')
  },
  contextType: {
    module: path.join(__dirname, '../context'),
    export: 'IRequestContext'
  }
});