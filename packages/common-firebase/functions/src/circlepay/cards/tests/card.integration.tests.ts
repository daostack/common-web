import { v4 } from 'uuid';
import firebaseFunctionsTests from 'firebase-functions-test';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mockers
import '../../../util/tests/helpers/mockers/getUser.mocker';

import { circleApp, getTestAuthenticationToken } from '../../../util/tests/helpers';

import { ICircleCreateCardResponse } from '../../types';
import { IGetCircleCardResponse } from '../../client/getCardFromCircle';

import {
  createCardSuccessfulRequest,
  getCardFailedCvvCheck,
  getCardSuccessfulChecks
} from './data/testCardCirlceResponses';

import {
  invalidCreateCardRequest_MissingKeyId,
  invalidCreateCardRequest_PassedDate,
  validCreateCardRequest
} from './data/testCardRequests';

import { ErrorCodes } from '../../../constants';

const circleMatcher = /.+circle\.com\/.*/;

const test = firebaseFunctionsTests({
  projectId: 'common-tests'
});

describe('Card creation process', () => {
  afterAll(async () => {
    await test.cleanup();
  });

  it('should work', () => {
    expect(true).toBeTruthy();
  });

  it('should be healthy', async () => {
    const authToken = await getTestAuthenticationToken(v4());

    const response = await circleApp
      .get('/health')
      .set({
        Authorization: authToken
      });


    expect(response.status).toBe(200);
    expect(response.body.healthy).toBeTruthy();
  });

  describe('Card creation validation', () => {
    it('should create the card with all the data valid ', async () => {
      const cardOwnerId = v4();
      const mock = new MockAdapter(axios);

      mock.onPost(new RegExp(circleMatcher.source + (/\/cards/).source))
        .reply<ICircleCreateCardResponse>(200, createCardSuccessfulRequest);

      mock.onGet(new RegExp(circleMatcher.source + (/\/cards/).source))
        .reply<IGetCircleCardResponse>(200, getCardSuccessfulChecks);

      const response = await circleApp
        .post('/create-card')
        .send(validCreateCardRequest)
        .set({
          Authorization: getTestAuthenticationToken(cardOwnerId)
        });

      expect(response.status).toBe(200);
      expect(response.body.ownerId).toEqual(cardOwnerId);

      mock.restore();
    });

    it('should fail if the encryption key ID was not provided', async () => {
      const cardOwnerId = v4();

      const response = await circleApp
        .post('/create-card')
        .send(invalidCreateCardRequest_MissingKeyId)
        .set({
          Authorization: getTestAuthenticationToken(cardOwnerId)
        });

      expect(response.status).toBe(422);
      expect(response.body.data.errorCode).toBe(ErrorCodes.ValidationError);
      expect(response.body.data.detailedErrors).toMatchSnapshot();
    });

    it('should fail if the card expiry date is in the past ', async () => {
      const cardOwnerId = v4();

      const response = await circleApp
        .post('/create-card')
        .send(invalidCreateCardRequest_PassedDate)
        .set({
          Authorization: getTestAuthenticationToken(cardOwnerId)
        });

      expect(response.status).toBe(422);
      expect(response.body.data.errorCode).toBe(ErrorCodes.ValidationError);
      expect(response.body.data.detailedErrors).toMatchSnapshot();
    });

    it('should fail if no body is provided whatsoever', async () => {
      const cardOwnerId = v4();

      const response = await circleApp
        .post('/create-card')
        .send()
        .set({
          Authorization: getTestAuthenticationToken(cardOwnerId)
        });

      expect(response.status).toBe(422);
      expect(response.body.data.detailedErrors).toMatchSnapshot();
    });
  });

  describe('General card creation safeguard', () => {
    it('should fail if the user does not exist', async () => {
      const cardOwnerId = '404';
      const mock = new MockAdapter(axios);

      mock.onPost(new RegExp(circleMatcher.source + (/\/cards/).source))
        .reply<ICircleCreateCardResponse>(200, createCardSuccessfulRequest);

      const response = await circleApp
        .post('/create-card')
        .send(validCreateCardRequest)
        .set({
          Authorization: getTestAuthenticationToken(cardOwnerId)
        });

      expect(response.status).toEqual(404);
      expect(response.body.error.includes('Cannot find 404 with identifier user.userId'));

      mock.restore();
    });

    it('should fail if the CVV is incorrect', async () => {
      const cardOwnerId = v4();
      const mock = new MockAdapter(axios);

      mock.onPost(new RegExp(circleMatcher.source + (/\/cards/).source))
        .reply<ICircleCreateCardResponse>(200, createCardSuccessfulRequest);

      mock.onGet(new RegExp(circleMatcher.source + (/\/cards/).source))
        .reply<IGetCircleCardResponse>(200, getCardFailedCvvCheck);

      const response = await circleApp
        .post('/create-card')
        .send(validCreateCardRequest)
        .set({
          Authorization: getTestAuthenticationToken(cardOwnerId)
        });

      expect(response.status).toBe(500);
      expect(response.body.data.errorCode).toBe(ErrorCodes.CvvVerificationFail);

      mock.restore();
    });
  });
});