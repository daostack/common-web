import { _createCircleCard } from './cards/_createCard';
import { _getCircleCard } from './cards/_getCard';

import { _createCirclePayment } from './payment/_createPayment';
import { _getPayment } from './payment/_getPayment';
import { _createWire } from '@circle/wires/_createWire';
import { _createCirclePayout } from '@circle/payouts/_createPayout';
import { _getPayout } from '@circle/payouts/_getPayout';
import { _getEncryptionKey } from '@circle/general/encryption';

export const circleClient = {
  cards: {
    /**
     * Create card in the circle settings. This does not
     * create card in our database
     */
    create: _createCircleCard,

    /**
     * Get card from the circle settings. There may be
     * differences in the card provided by them from
     * what we currently have in our database
     */
    get: _getCircleCard
  },

  payments: {
    /**
     * Create payment in the circle settings. This does not
     * create payment in our database. Please make sure that the amount
     * is correct as Circle uses full dollar amount and not cents
     */
    create: _createCirclePayment,

    /**
     * Get payment from the circle settings. There may be
     * differences in the payment provided by them from
     * what we currently have in our database
     */
    get: _getPayment
  },

  payouts: {
    /**
     * Executes payout in the circle system. No verification check
     * are being performed here! The amount is in dollars, not cents!
     */
    create: _createCirclePayout,

    get: _getPayout
  },

  wires: {
    /**
     * Creates new wires account in the circle system. This also
     * should make sure that the details provided are valid and
     * up to standard
     */
    create: _createWire
  },

  general: {
    getEncryptionKey: _getEncryptionKey
  }
};