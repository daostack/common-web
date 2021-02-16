import { objectType } from 'nexus';

export const SubscriptionMetadataCommonType = objectType({
  name: 'SubscriptionMetadataCommon',
  definition(t) {
    t.id('id');
    t.string('name');
  }
});