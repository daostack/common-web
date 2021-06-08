import { inputObjectType } from 'nexus';

export const CommonRuleInput = inputObjectType({
  name: 'CommonRuleInput',
  definition(t) {
    t.nonNull.string('title');

    t.string('description');
  }
});