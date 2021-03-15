import path from 'path';

import { makeSchema } from 'nexus';

import { UserTypes } from './Users';

const types = [
  UserTypes
];

export const schema = makeSchema({
  types,
  outputs: {
    typegen: path.join(__dirname, '../generated/', 'nexus-typegen.ts'),
    schema: path.join(__dirname, '../generated/', 'schema.graphql')
  }
});