import { objectType } from 'nexus';

import { CardNetworkEnum } from '../enums/CardNetwork.enum';
import { CardBillingDetailsType } from './CardBillingDetails.type';

export const CardMetadataType = objectType({
  name: 'CardMetadata',
  definition(t) {
    t.string('digits');

    t.field('network', {
      type: CardNetworkEnum
    });

    t.field('billingDetails', {
      type: CardBillingDetailsType
    });
  }
});