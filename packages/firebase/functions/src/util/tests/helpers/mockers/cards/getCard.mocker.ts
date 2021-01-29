import { NotFoundError } from '../../../../errors';
import { ICardEntity } from '../../../../../circlepay/cards/types';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;


jest.mock('../../../../../circlepay/cards/database/getCard', () => ({
  getCard: jest.fn()
    .mockImplementation(async (cardId: string): Promise<ICardEntity> => {
      if (cardId === '404') {
        throw new NotFoundError('cardId', cardId);
      }

      return {
        id: cardId,
        circleCardId: cardId,
        metadata: undefined,
        ownerId: cardId,
        verification: {
          cvv: cardId === '00000000-0000-0000-0000-000000000000'
            ? 'fail'
            : 'pass'
        },
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now()
      };
    })
}));