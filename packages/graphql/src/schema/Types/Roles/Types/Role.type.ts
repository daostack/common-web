import { objectType } from 'nexus';

export const RoleType = objectType({
  name: 'Role',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.string('name');
    t.nonNull.string('displayName');

    t.nonNull.string('description');


    t.nonNull.list.nonNull.string('permissions');
  }
});