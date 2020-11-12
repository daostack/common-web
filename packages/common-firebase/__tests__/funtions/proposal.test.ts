import supertest from 'supertest';
import firebaseFunctionsTests from 'firebase-functions-test';

import * as functions from '../../functions/src';
import { getAuthToken } from '../helpers/auth';
import { proposalsApp } from '../helpers/supertests';
import { createTestCommon } from '../helpers/createTestCommon';
import exp = require('constants');

const proposal = supertest(functions.commons);

const joinEndpoint = '/create/join';
const fundingEndpoint = '/create/funding';

const test = firebaseFunctionsTests({
  projectId: 'common-tests'
});

const invalidJoinCreationPayload = {
  name: 'Hello, I\'m a test',
  description: 'I should not be created tho as I\'m incomplete'
};

const invalidFundingCreationPayload = {
  name: 'Hello, I\'m a test',
  description: 'I should not be created tho as I\'m incomplete'
};

const validJoinData = (commonId: string) => ({
  commonId,
  description: 'I wanna be a part',
  funding: 50000
});

const validFundingData = (commonId: string) => ({
  commonId,
  description: 'I wanna be a part',
  amount: 50000
});

describe('Proposal Related Cloud Functions', () => {
  afterAll(async () => {
    await test.cleanup();
  });

  it('should work', () => {
    expect(true).toBeTruthy();
  });

  it('should be healthy', async () => {
    const authToken = await getAuthToken('test-user');

    const response = await proposalsApp
      .get('/health')
      .set({
        Authorization: authToken
      });


    expect(response.status).toBe(200);
    expect(response.body.healthy).toBeTruthy();
  });

  describe('Join Proposal Creation', () => {
    it('should require authentication for join request creation', async () => {
      // Setup
      const common = await createTestCommon();

      // Act
      const response = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinData(common.id));

      expect(response.status).toBe(401);
      expect(response.body.errorCode).toBe('AuthenticationError');
    });

    it('should fail validation on invalid input', async () => {
      // Setup
      const authToken = await getAuthToken('test-user');

      // Act
      const response = await proposalsApp
        .post(joinEndpoint)
        .send(invalidJoinCreationPayload)
        .set({
          Authorization: authToken
        });

      // Assert
      expect(response.status).toBe(422);
      expect(response.body.errorCode).toBeDefined();
      expect(response.body.errorCode).toBe('ValidationError');
      expect(response.body.data.errors).toMatchSnapshot();
    });

    it('should not allow founders to create join requests', async () => {
      // Setup
      const authToken = await getAuthToken('test-user');
      const common = await createTestCommon('test-user');

      // Act
      const response = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinData(common.id))
        .set({
          Authorization: authToken
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toBe('Cannot create join request for commons, that you are a member of');
    });

    it('should not allow to create join requests, if there is ongoing one', async () => {
      // Setup
      const authToken = await getAuthToken('test-user');
      const common = await createTestCommon('test-user');

      // Act
      const response = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinData(common.id))
        .set({
          Authorization: authToken
        });

      // @todo
    });

    it('should make join request with valid input in commons, that you are not member of', async () => {
      // Setup
      const authToken = await getAuthToken('test-user');
      const common = await createTestCommon('another-test');

      // Act
      const response = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinData(common.id))
        .set({
          Authorization: authToken
        });

      // Assert
      expect(response.body.message).toBe('Join request successfully created!');
      expect(response.body.proposerId).toBe('test-user');
      expect(response.body.type).toBe('join');
      expect(response.body.commonId).toBe(common.id);
    });
  });

  describe('Funding Proposal Creation', () => {
    it('should require authentication for funding proposals creation', async () => {
      // Setup
      const common = await createTestCommon();

      // Act
      const response = await proposalsApp
        .post(fundingEndpoint)
        .send(validJoinData(common.id));

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.errorCode).toBe('AuthenticationError');
    });

    it('should not allow non members to create funding requests', async () => {
      // Setup
      const common = await createTestCommon('test-user');
      const authToken = await getAuthToken('test-user-not-member');

      // Act
      const response = await proposalsApp
        .post(fundingEndpoint)
        .send(validFundingData(common.id))
        .set({
          Authorization: authToken
        });

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.error.includes('User tried to create funding request in common, that he is not part of')).toBeTruthy();
    });

    it('should fail on invalid input', async () => {
      // Setup
      const authToken = await getAuthToken('test-user-not-member');

      // Act
      const response = await proposalsApp
        .post(fundingEndpoint)
        .send(invalidFundingCreationPayload)
        .set({
          Authorization: authToken
        });

      // Assert
      expect(response.status).toBe(422);
      expect(response.body.data.errors).toMatchSnapshot();
    });

    it('should create funding request on valid data in commons, that you are a member of', async () => {
      // Setup
      const common = await createTestCommon('test-user');
      const authToken = await getAuthToken('test-user');

      // Act
      const response = await proposalsApp
        .post(fundingEndpoint)
        .send(validFundingData(common.id))
        .set({
          Authorization: authToken
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Funding request successfully created!');

      expect(response.body.proposerId).toBe('test-user');
      expect(response.body.type).toBe('fundingRequest');
      expect(response.body.state).toBe('countdown');
    });
  });
});