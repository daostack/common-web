import { inputObjectType } from 'nexus';

export const PaginateInput = inputObjectType({
  name: 'PaginateInput',
  definition(t) {
    t.nonNull.int('take');

    t.int('skip', {
      default: 0
    });
  }
});