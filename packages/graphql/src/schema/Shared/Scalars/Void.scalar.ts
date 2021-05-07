import { scalarType } from 'nexus';

export const VoidScalar = scalarType({
  name: 'Void',
  asNexusMethod: 'void'
});