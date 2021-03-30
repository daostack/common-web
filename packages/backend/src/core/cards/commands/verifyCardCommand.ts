import { Card, EventType } from '@prisma/client';

import { circleClient } from '@clients';
import { ICircleCard } from '@circle/types';

import { poll } from '@utils';
import { IPollValidator, IPollAction } from '@utils/types';
import { eventsService } from '@services';
import { prisma } from '@toolkits';
import { CvvVerificationCheckError } from '@errors';

interface IVerifyCommandOptions {
  /**
   * Whether the passed card will be deleted upon failure
   */
  deleteOnFailure: boolean;

  /**
   * Whether the command will throw upon failure
   */
  throwOnFailure: boolean;
}

const defaultOptions: Partial<IVerifyCommandOptions> = {
  deleteOnFailure: false,
  throwOnFailure: false
};

/**
 * Does polling on the passed card until CVV and AVS verifications are in terminal states
 *
 * @param card          - The card to verify
 * @param customOptions - Options, modifying the command behaviour
 *
 * @throws { CvvVerificationCheckError } - If selected in options and the CVV check fails
 * @throws { AvsVerificationCheckError } - If selected in options and the AVS check fails
 *
 * @returns - Boolean, identifying whether the check was successful or not
 */
export const verifyCardCommand = async (card: Card, customOptions?: Partial<IVerifyCommandOptions>): Promise<boolean> => {
  const options = {
    ...defaultOptions,
    ...customOptions
  };

  const pollAction: IPollAction<ICircleCard> = async () => {
    return (await circleClient.cards.get(card.circleCardId)).data;
  };

  const pollValidator: IPollValidator<ICircleCard> = (card) => {
    return card.verification.avs !== 'pending' && card.verification.cvv !== 'pending';
  };

  const circleCard = await poll<ICircleCard>(pollAction, pollValidator);

  if (circleCard.verification.cvv !== card.cvvCheck) {
    const cvvCheck = circleCard.verification.cvv;

    // Create an event
    if (
      cvvCheck !== 'pending' &&
      cvvCheck !== 'unavailable'
    ) {
      await eventsService.create({
        userId: card.userId,
        type: cvvCheck === 'fail'
          ? EventType.CardCvvVerificationFailed
          : EventType.CardCvvVerificationPassed
      });
    }

    // Delete card if requested otherwise update
    if (options.deleteOnFailure && cvvCheck === 'fail') {
      await prisma.card.delete({
        where: {
          id: card.id
        }
      });
    } else {
      card = await prisma.card.update({
        where: {
          id: card.id
        },
        data: {
          cvvCheck
        }
      });
    }

    // Throw error if requested
    if (options.throwOnFailure && cvvCheck === 'fail') {
      throw new CvvVerificationCheckError(card.id);
    }
  }

  // @todo Do the AVS check

  return circleCard.verification.cvv !== 'fail';
};