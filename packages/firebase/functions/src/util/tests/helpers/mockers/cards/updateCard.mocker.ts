import { ICardEntity } from '../../../../../circlepay/cards/types';

jest.mock('../../../../../circlepay/cards/database/updateCard', () => ({
  updateCardInDatabase: jest.fn()
    .mockImplementation((card: ICardEntity): Promise<ICardEntity> => Promise.resolve(card))
}));