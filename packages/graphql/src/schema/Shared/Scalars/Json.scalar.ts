import { asNexusMethod } from 'nexus';
import { GraphQLJSON } from 'graphql-scalars';

export const JsonScalar = asNexusMethod(GraphQLJSON, 'json');