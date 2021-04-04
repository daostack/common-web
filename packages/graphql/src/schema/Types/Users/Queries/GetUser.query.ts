import { extendType } from 'nexus';

export const GetUserQuery = extendType({
  type: 'Query',
  definition: function (t) {
    t.crud.user();
  }
});