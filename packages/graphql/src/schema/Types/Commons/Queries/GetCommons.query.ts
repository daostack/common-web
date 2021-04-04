import { extendType } from 'nexus';

export const GetCommonsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.commons({
      filtering: true
    });
  }
});