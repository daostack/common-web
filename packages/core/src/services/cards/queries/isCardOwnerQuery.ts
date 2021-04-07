import { prisma } from '../../../domain/toolkits/index';
import { NotFoundError } from '../../../domain/errors/index';

/***
 * Checks whether the passed user id is the same
 * as the id of the card
 *
 * @param cardId - The card against which we are going to check
 * @param userId - The expected card owner
 *
 * @throws { NotFoundError } - If no card with the passed ID is found
 *
 * @returns - Boolean whether the user is the owner of the card
 */
export const isCardOwnerQuery = async (cardId: string, userId: string): Promise<boolean> => {
  const card = await prisma.card.findUnique({
    where: {
      id: cardId
    },
    select: {
      id: true,
      userId: true
    }
  });

  // @todo Move this to be ORM middleware
  if (!card) {
    throw new NotFoundError('card', cardId);
  }

  return card.userId === userId;
};