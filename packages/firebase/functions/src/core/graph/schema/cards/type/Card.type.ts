import { objectType } from 'nexus';
import { CardMetadataType } from './CardMetadata.type';
import { CardVerificationType } from './CardVerification.type';

export const CardType = objectType({
  name: 'Card',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The ID of the payment'
    });

    t.nonNull.date('createdAt', {
      description: 'The date at witch the payment was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date at witch the payment was last updated'
    });

    t.nonNull.id('circleCardId');
    t.nonNull.id('ownerId');

    t.field('metadata', {
      type: CardMetadataType
    });

    t.field('verification', {
      type: CardVerificationType
    });
  }
});