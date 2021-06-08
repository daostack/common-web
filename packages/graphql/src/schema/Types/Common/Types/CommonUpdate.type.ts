import { objectType } from 'nexus';

export const CommonUpdateType = objectType({
  name: 'CommonUpdate',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.field('commonBefore', {
      type: 'Common',
      resolve: (root) => JSON.parse((root as any).commonBefore)
    });

    t.nonNull.field('commonAfter', {
      type: 'Common',
      resolve: (root) => JSON.parse((root as any).commonAfter)
    });

    t.json('change', {
      resolve: (root) => JSON.parse((root as any).change)
    });
  }
});