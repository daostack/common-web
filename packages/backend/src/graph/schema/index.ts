import path from 'path';
import { makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';

import { UserTypes } from './Core/Users';
import { CommonTypes } from './Core/Commons';
import { ProposalTypes } from './Core/Proposals';

import { LinkType, LinkInputType } from './Shared/Types/Link.type';
import { DateScalar } from './Shared/Scalars/Date.scalar';


const types = [
  UserTypes,
  CommonTypes,
  ProposalTypes,

  // Scalars
  DateScalar,

  // Shared Types
  LinkType,

  // Shared Input Types
  LinkInputType
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
  },
  plugins: [
    nexusPrisma({
      experimentalCRUD: true
    })
  ]
});