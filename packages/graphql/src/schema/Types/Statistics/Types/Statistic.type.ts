import { objectType } from 'nexus';

export const StatisticType = objectType({
  name: 'Statistic',
  definition(t) {
    t.implements('BaseEntity');

    t.nonNull.int('users');
    t.nonNull.int('commons');
    t.nonNull.int('fundingProposals');
    t.nonNull.int('joinProposals');
  }
});