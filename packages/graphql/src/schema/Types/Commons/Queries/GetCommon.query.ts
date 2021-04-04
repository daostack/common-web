import { extendType } from 'nexus';

export const GetCommonQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.common();
  }
});
