import { inputObjectType } from 'nexus';

export const StringFilterInput = inputObjectType({
  name: 'StringFilter',
  definition(t) {
    t.string('contains');
    t.string('endsWith');
    t.string('equals');
    t.string('gt');
    t.string('gte');
    t.string('lt');
    t.string('lte');
    t.string('startsWith');

    t.list.nonNull.string('in');
    t.list.nonNull.string('notIn');
  }
});