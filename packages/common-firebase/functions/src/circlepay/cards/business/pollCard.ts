import { poll } from '../../../util';
import { IPollAction, IPollValidator } from '../../../util/poll';

import { ArgumentError, CvvVerificationError } from '../../../util/errors';

import { circleClient, ICircleCard } from '../../client';
import { ICardEntity } from '../types';
import { cardDb } from '../database';

interface IPollCardOptions {
  interval: number;
  maxRetries: number;

  throwOnCvvFail: boolean;
  deleteCardOnCvvFail: boolean;
}

const defaultCardOptions: IPollCardOptions = {
  interval: 60,
  maxRetries: 32,

  throwOnCvvFail: true,
  deleteCardOnCvvFail: false
};

/**
 * Polls card until the card reaches desired state
 *
 * @param card - The entity of the card we want to poll
 * @param pollCardOptions - *Optional* Options for the card polling
 */
export const pollCard = async (card: ICardEntity, pollCardOptions?: Partial<IPollCardOptions>): Promise<ICardEntity> => {
  if (!card) {
    throw new ArgumentError('card', card);
  }

  const options = {
    ...defaultCardOptions,
    ...pollCardOptions
  };

  const pollAction: IPollAction<ICircleCard> = async () => {
    return (await circleClient.getCard(card.circleCardId)).data;
  };

  const pollValidator: IPollValidator<ICircleCard> = (card) => {
    return card.verification.avs !== 'pending' &&
      card.verification.cvv !== 'pending';
  };

  const circleCardObj = await poll<ICircleCard>(pollAction, pollValidator, options.interval, options.maxRetries);

  // Update the CVV verification check of the entity if it has changed
  if (circleCardObj.verification.cvv !== card.verification.cvv) {
    card = await cardDb.update({
      ...card,
      verification: {
        ...card.verification,
        cvv: circleCardObj.verification.cvv as any
      }
    });

    if (circleCardObj.verification.cvv === 'fail') {
      logger.notice('CVV verification failed for card', {
        card,
        circleCard: circleCardObj
      });

      if (options.deleteCardOnCvvFail) {
        // @todo Soft delete card entity on CVV check if options require it
      }

      if (options.throwOnCvvFail) {
        throw new CvvVerificationError(card.id);
      }
    }
  }

  // Return the updated card
  return card;
};