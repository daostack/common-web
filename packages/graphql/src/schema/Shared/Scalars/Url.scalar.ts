import { asNexusMethod } from 'nexus';
import { GraphQLURL } from 'graphql-scalars';

export const UrlScalar = asNexusMethod(GraphQLURL, 'url');