import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { v4 } from 'uuid';

// Add the logger to the tests globals
import '../../../util/logger';
import '../../../util/tests/helpers/mockers/cards/getCard.mocker';
import '../../../util/tests/helpers/mockers/commons/getCommon.mocker';
import '../../../util/tests/helpers/mockers/commons/updateCommon.mocker';
import '../../../util/tests/helpers/mockers/getUser.mocker';
import '../../../util/tests/helpers/mockers/payments/addPayment.mocker';

// Mockers
import '../../../util/tests/helpers/mockers/payments/updatePayment.mocker';
import '../../../util/tests/helpers/mockers/proposals/getJoinRequest.mocker';
import '../../../util/tests/helpers/mockers/proposals/getProposal.mocker';
import '../../../util/tests/helpers/mockers/proposals/updateProposal.mocker';
import '../../../util/tests/helpers/mockers/subscriptions/getSubscription.mocker';
import '../../../util/tests/helpers/mockers/subscriptions/updateSubscription.mocker';

import { ICircleCreatePaymentResponse, ICirclePayment } from '../../types';
import { createPayment } from '../business/createPayment';
import { createProposalPayment } from '../business/createProposalPayment';
import { pollPayment } from '../business/pollPayment';
import {
  createPaymentValidResponse,
  getPaymentFailedResponse,
  getPaymentPendingResponce,
  getPaymentSuccessfulResponce
} from './data/testCircleResponses';

import { pendingPaymentEntity, successfulPaymentEntity } from './data/testPaymentEntities';
import {
  createPaymentInvalidPayload,
  createPaymentValidPayload,
  createProposalPaymentInvalidPayload,
  createProposalPaymentValidPayload
} from './data/testPaymentPayloads';

const circleMatcher = /.+circle\.com\/.*/;
const circePaymentEndpointMatcher = new RegExp(circleMatcher.source + (/\/payments/).source);

// ----- Local Mocks

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    Timestamp: jest.fn(() => ({
      now: jest.fn()
    })),
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
  }))
}));

jest.mock('../../../util/db/eventDbService', () => ({
  createEvent: jest.fn()
}));

describe('Payment Unit Tests', () => {
  describe('Payment polling', () => {
    it('should poll until successful status is reached', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpy = jest.spyOn(axios, 'get');


      // On the initial 10 calls return pending
      for (let i = 0; i < 10; i++) {
        mock
          .onGet(circePaymentEndpointMatcher)
          .replyOnce<ICirclePayment>(200, getPaymentPendingResponce);
      }

      // On the 11th and all sequential calls return check success
      mock
        .onGet(circePaymentEndpointMatcher)
        .reply<ICirclePayment>(200, getPaymentSuccessfulResponce);

      // Act
      const pollResult = await pollPayment(successfulPaymentEntity, {
        interval: 0
      });

      // Assert
      expect(pollResult.fees).toMatchSnapshot();
      expect(mockSpy).toHaveBeenCalledTimes(11);

      // Cleanup
      mock.restore();
      mockSpy.mockClear();
    });

    it('should poll until failed status is reached', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpy = jest.spyOn(axios, 'get');


      // On the initial 10 calls return pending
      for (let i = 0; i < 10; i++) {
        mock
          .onGet(circePaymentEndpointMatcher)
          .replyOnce<ICirclePayment>(200, getPaymentPendingResponce);
      }

      // On the 11th and all sequential calls return check success
      mock
        .onGet(circePaymentEndpointMatcher)
        .reply<ICirclePayment>(200, getPaymentFailedResponse);

      // Act
      const pollResult = await pollPayment(pendingPaymentEntity, {
        interval: 0
      });

      // Assert
      expect(pollResult.status).not.toBe('pending');
      expect(mockSpy).toHaveBeenCalledTimes(11);

      // Cleanup
      mock.restore();
      mockSpy.mockClear();
    });

    it('should throw if failed status is reached and throw was requested', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpy = jest.spyOn(axios, 'get');

      mock
        .onGet(circePaymentEndpointMatcher)
        .reply<ICirclePayment>(200, getPaymentFailedResponse);

      // Act and Assert
      await expect(pollPayment(pendingPaymentEntity, {
        interval: 0,
        throwOnPaymentFailed: true
      }))
        .rejects
        .toThrowError('Payment failed');

      // Cleanup
      mock.restore();
      mockSpy.mockClear();
    });

    it('should throw if the maximum poll attempts are reached', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpy = jest.spyOn(axios, 'get');

      // Only pending responses
      mock
        .onGet(circePaymentEndpointMatcher)
        .reply<ICirclePayment>(200, getPaymentPendingResponce);

      // Act and assert
      await expect(pollPayment(pendingPaymentEntity, {
        interval: 0
      }))
        .rejects
        .toThrowError('Max polling attempts reached!');

      // Cleanup
      mock.restore();
      mockSpy.mockClear();
    });
  });

  describe('General payments', () => {
    it('should not create payment whit invalid data', async () => {
      // Act & Assert
      await expect(createPayment(createPaymentInvalidPayload as any))
        .rejects
        .toThrowError('Validation failed');
    });

    it('should not create payment for user, that is not owner of the payment method', async () => {
      // Arrange
      const testData = {
        ...createPaymentValidPayload,

        // The card owner is with the same ID as the card itself
        // during the mocking, so giving the user and card different
        // random IDs should result it owner ID mismatch
        userId: v4(),
        cardId: v4()
      };

      // Act & Assert
      await expect(createPayment(testData as any))
        .rejects
        .toThrowError('Cannot charge card, that you do not own');
    });

    it('should not create the payment if the payment method is not verified', async () => {
      // Arrange
      const testData = {
        ...createPaymentValidPayload,

        // If the card ID is default GUID the mocker will return
        // card with failed CVV check
        userId: '00000000-0000-0000-0000-000000000000',
        cardId: '00000000-0000-0000-0000-000000000000'
      };

      // Act & Assert
      await expect(createPayment(testData as any))
        .rejects
        .toThrowError('CVV verification failed for card with ID 00000000-0000-0000-0000-000000000000');
    });

    it('should successfully create payment given valid data', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpyPost = jest.spyOn(axios, 'post');

      mock
        .onPost(circePaymentEndpointMatcher)
        .reply<ICircleCreatePaymentResponse>(200, createPaymentValidResponse);

      // Act
      const createdPayment = await createPayment(createPaymentValidPayload as any);

      // Assert
      expect(createdPayment).toBeTruthy();
      expect(createdPayment.amount.amount).toEqual(createPaymentValidPayload.amount);

      // Cleanup
      mock.restore();
      mockSpyPost.mockClear();
    });
  });

  describe('One-time payments', () => {
    it('should fail with invalid payload', async () => {
      // Act and assert
      await expect(createProposalPayment(createProposalPaymentInvalidPayload))
        .rejects
        .toThrowError('Validation failed');
    });

    it('should fail if the proposal is not found', async () => {
      // Act and assert
      await expect(createProposalPayment({
        ...createProposalPaymentValidPayload,
        proposalId: '00000000-0000-0000-0000-000000000000'
      }))
        .rejects
        .toThrowError('Cannot find proposal with identifier 00000000-0000-0000-0000-000000000000');
    });

    it('should fail if the proposal is for subscription based common', async () => {
      // Act and assert
      await expect(createProposalPayment({
        ...createProposalPaymentValidPayload,
        proposalId: '00000000-0000-0000-0000-000000000001'
      }))
        .rejects
        .toThrowError(
          'Cannot create proposal payment for proposals that are not of funding type `one-time`. ' +
          'For charging subscription proposals you must use `createSubscriptionPayment`!'
        );
    });

    it('should create the payment given the correct payload', async () => {
      // Arrange
      const mock = new MockAdapter(axios);
      const mockSpyPost = jest.spyOn(axios, 'post');

      mock
        .onPost(circePaymentEndpointMatcher)
        .reply<ICircleCreatePaymentResponse>(200, createPaymentValidResponse);

      mock
        .onGet(circePaymentEndpointMatcher)
        .reply<ICirclePayment>(200, getPaymentSuccessfulResponce);

      // Act
      const payment = await createProposalPayment(createProposalPaymentValidPayload);

      // Assert
      expect(payment.proposalId).toBe(createProposalPaymentValidPayload.proposalId);
      expect(payment.fees).toMatchSnapshot();
      expect(payment.status).toMatch(/paid|confirmed|failed/);

      // Cleanup
      mock.restore();
      mockSpyPost.mockClear();
    });
  });

  // describe('Subscription payments', () => {
  //
  // });
});
