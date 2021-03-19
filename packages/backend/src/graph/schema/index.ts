import path from 'path';
import { makeSchema } from 'nexus';

import { UserTypes } from './Core/Users';
import { CommonTypes } from './Core/Commons';
import { ProposalTypes } from './Core/Proposals';

import { LinkType, LinkInputType } from './Shared/Types/Link.type';
import { DateScalar } from './Shared/Scalars/Date.scalar';
import { BaseEntity } from './Shared/Interfaces/BaseEntity.interface';


const types = [
  UserTypes,
  CommonTypes,
  ProposalTypes,

  // Scalars
  DateScalar,

  // Interfaces
  BaseEntity,

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
  }
});