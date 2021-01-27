import { v4 } from 'uuid';

import '../../../util/tests/helpers/mockers/cards/getCard.mocker';
import '../../../util/tests/helpers/mockers/cards/updateCard.mocker';
import '../../../util/tests/helpers/mockers/firebase.mocker';

import { isCardOwner } from '../business/isCardOwner';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { IGetCircleCardResponse } from '../../client/getCardFromCircle';
import { getCardFailedCvvCheck, getCardPendingChecks, getCardSuccessfulChecks } from './data/testCardCirlceResponses';
import { pollCard } from '../business/pollCard';
import { pendingCardEntity } from './data/testCardEntities';


// Add the logger to the tests globals
import '../../../util/logger';

// ----- Local Mocks

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: () => ({
    collection: jest.fn(() => ({
      withConverter: jest.fn()
        .mockImplementation(() => jest.fn())
      //
      // where: jest.fn(queryString => ({
      //   get: mockQueryResponse
      //
      // }))
    })),
    settings: jest.fn()
  })
}));

// ----- Match helpers

const circleMatcher = /.+circle\.com\/.*/;
const circeCardEndpointMatcher = new RegExp(circleMatcher.source + (/\/cards/).source);

describe('Card unit tests', () => {
  describe('isCardOwner', () => {
    it('should return true if the card user is really the owner', async () => {
      // Arrange
      const ownerId = v4();

      // Act
      // The mocker sets the card ID to be the same as the owner ID
      const result = await isCardOwner(ownerId, ownerId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false if the user is not the owner', async () => {
      // Arrange
      const cardId = v4();
      const userId = v4();

      // Act
      // The mocker sets the card ID to be the same as the owner ID
      const result = await isCardOwner(userId, cardId);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('pollCard', () => {
    it('should finish on card verification success', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpy = jest.spyOn(axios, 'get');

      mock
        // On the first and second call return pending
        .onGet(circeCardEndpointMatcher)
        .replyOnce<IGetCircleCardResponse>(200, getCardPendingChecks)

        .onGet(circeCardEndpointMatcher)
        .replyOnce<IGetCircleCardResponse>(200, getCardPendingChecks)

        // On the third and all sequential calls return check success
        .onGet(circeCardEndpointMatcher)
        .reply<IGetCircleCardResponse>(200, getCardSuccessfulChecks);

      // Act
      const pollCardResult = await pollCard(pendingCardEntity);

      // Assert
      delete pollCardResult.updatedAt;
      delete pollCardResult.createdAt;

      expect(pollCardResult).toMatchSnapshot();
      expect(pollCardResult.verification.cvv).toBe('pass');

      expect(mockSpy).toHaveBeenCalledTimes(3);

      // Cleanup
      mock.restore();
      mockSpy.mockClear();
    });

    it('should finish on card verification failure', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpy = jest.spyOn(axios, 'get');

      mock
        // On the first and second call return pending
        .onGet(circeCardEndpointMatcher)
        .replyOnce<IGetCircleCardResponse>(200, getCardPendingChecks)

        .onGet(circeCardEndpointMatcher)
        .replyOnce<IGetCircleCardResponse>(200, getCardPendingChecks)

        // On the third and all sequential calls return check success
        .onGet(circeCardEndpointMatcher)
        .reply<IGetCircleCardResponse>(200, getCardFailedCvvCheck);

      // Act
      const pollCardResult = await pollCard(pendingCardEntity, {
        throwOnCvvFail: false
      });

      // Assert
      expect(pollCardResult).toBeTruthy();
      expect(pollCardResult.ownerId).toBeTruthy();
      expect(pollCardResult.verification.cvv).toBe('fail');

      expect(mockSpy).toHaveBeenCalledTimes(3);

      // Cleanup
      mock.restore();
      mockSpy.mockClear();
    });

    it('should throw on card verification failure if that is requests', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpy = jest.spyOn(axios, 'get');

      mock
        // On the first and second call return pending
        .onGet(circeCardEndpointMatcher)
        .replyOnce<IGetCircleCardResponse>(200, getCardPendingChecks)

        // On the second and all sequential calls return check success
        .onGet(circeCardEndpointMatcher)
        .reply<IGetCircleCardResponse>(200, getCardFailedCvvCheck);

      // Act & Assert
      await expect(pollCard(pendingCardEntity, { throwOnCvvFail: true }))
        .rejects
        .toThrowError('CVV verification failed for card');

      expect(mockSpy).toHaveBeenCalledTimes(2);

      // Cleanup
      mock.restore();
      mockSpy.mockClear();
    });
  });
});