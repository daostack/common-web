import { _createCircleCard } from './cards/_createCard';
import { _getCircleCard } from './cards/_getCard';

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
  }
};