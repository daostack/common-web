import { extendType } from 'nexus';

import { CardType } from '../../cards/type/Card.type';
import { cardDb } from '../../../../../circlepay/cards/database';

export const PaymentCardExtension = extendType({
  type: 'Payment',
  definition(t) {
    t.field('card', {
      type: CardType,
      resolve: (root) => {
        return cardDb.get(root.source?.id);
      }
    });
  }
});