import { objectType } from 'nexus';

import { CommonContributionTypeEnum } from '../enums/CommonContributionType.enum';

export const CommonMetadataType = objectType({
  name: 'CommonMetadata',
  definition(t) {
    t.nonNull.string('founderId');
    t.nonNull.int('minFeeToJoin');

    t.field('contributionType', {
      type: CommonContributionTypeEnum
    });
  },
});