import path from 'path';
import { makeSchema } from 'nexus';
import { nexusPrisma } from 'nexus-plugin-prisma';

import { UserTypes } from './Core/Users';
import { CardTypes } from './Core/Cards';
import { VoteTypes } from './Core/Votes';
import { CommonTypes } from './Core/Commons';
import { ProposalTypes } from './Core/Proposals';

import { DateScalar } from './Shared/Scalars/Date.scalar';
import { LinkType, LinkInputType } from './Shared/Types/Link.type';
import { BillingDetailsInput } from './Shared/Inputs/BillingDetails.input';


const types = [
  UserTypes,
  CardTypes,
  VoteTypes,
  CommonTypes,
  ProposalTypes,

  // Scalars
  DateScalar,

  // Shared Types
  LinkType,

  // Shared Input Types
  LinkInputType,
  BillingDetailsInput
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
      experimentalCRUD: true,
      outputs: {
        typegen: path.join(__dirname, '../generated/', 'nexus-prisma-typegen.ts')
      }
    })
  ]
});