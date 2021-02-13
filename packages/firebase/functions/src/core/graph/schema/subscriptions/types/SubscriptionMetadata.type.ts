import { objectType } from 'nexus';

import { SubscriptionMetadataCommonType } from './SubscriptionMetadataCommon.type';

export const SubscriptionMetadataType = objectType({
  name: 'SubscriptionMetadata',
  definition(t) {
    t.field('common', {
      type: SubscriptionMetadataCommonType
    });
  }
});

