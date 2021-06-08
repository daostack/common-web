import { inputObjectType } from 'nexus';

export const CommonLinkInput = inputObjectType({
  name: 'CommonLinkInput',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('url');
  }
});