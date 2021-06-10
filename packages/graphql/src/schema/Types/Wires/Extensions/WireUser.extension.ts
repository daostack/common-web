import { extendType } from 'nexus';

export const WireUserExtension = extendType({
  type: 'Wire',
  definition(t) {
    t.nonNull.string('userId');
  }
});