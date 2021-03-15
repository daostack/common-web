import path from 'path';

import { makeSchema } from 'nexus';

export const schema = makeSchema({
  types: [],
  outputs: {
    typegen: path.join(__dirname, '..', 'nexus-typegen.ts'),
    schema: path.join(__dirname, '..', 'schema.graphql')
  }
});