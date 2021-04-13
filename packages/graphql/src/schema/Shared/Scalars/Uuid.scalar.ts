import { asNexusMethod } from 'nexus';
import { GraphQLUUID } from 'graphql-scalars';

export const UuidScalar = asNexusMethod(GraphQLUUID, 'uuid');