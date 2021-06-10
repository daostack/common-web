import { objectType } from 'nexus';

export const WireType = objectType({
  name: 'Wire',
  definition(t) {
    t.implements('BaseEntity');

    t.string('circleId');
    t.string('circleFingerprint');

    t.string('description');
  }
});