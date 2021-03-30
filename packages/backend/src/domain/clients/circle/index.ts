import { _createCircleCard } from './cards/_createCard';
import { _getCircleCard } from './cards/_getCard';

import { _createCirclePayment } from './payment/_createPayment';
import { _getPayment } from '@circle/payment/_getPayment';

export const circleClient = {
  cards: {
    /**
     * Create card in the circle system. This does not
     * create card in our database
     */
    create: _createCircleCard,

    /**
     * Get card from the circle system. There may be
     * differences in the card provided by them from
     * what we currently have in our database
     */
    get: _getCircleCard
  },

  payments: {
    /**
     * Create payment in the circle system. This does not
     * create payment in our database. Please make sure that the amount
     * is correct as Circle uses full dollar amount and not cents
     */
    create: _createCirclePayment,

    /**
     * Get payment from the circle system. There may be
     * differences in the payment provided by them from
     * what we currently have in our database
     */
    get: _getPayment
  }
};