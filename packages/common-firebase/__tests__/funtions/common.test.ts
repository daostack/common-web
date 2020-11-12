import supertest from 'supertest';
import firebaseFunctionsTests from 'firebase-functions-test';

import * as functions from '../../functions/src';
import { getAuthToken } from '../helpers/auth';

const common = supertest(functions.commons);

const test = firebaseFunctionsTests({
  projectId: 'common-tests'
});

const invalidCommonCreationPayload = {
  name: 'Hello, I\'m a test',
  description: 'I should not be created tho as I\'m incomplete'
};

const validCommonCreationPayload = {
  'name': 'Common Test',
  'image': 'https://llandscapes-10674.kxcdn.com/wp-content/uploads/2019/07/lighting.jpg',
  'action': 'to do or not to',
  'byline': 'basically',
  'description': 'hey there, am i descriptive',
  'contributionType': 'one-time',
  'contributionAmount': 6500
};

describe('Common Related Cloud Functions', () => {
  afterAll(async () => {
    await test.cleanup();
  });

  it('should work', () => {
    expect(true).toBeTruthy();
  });

  it('should be healthy', async () => {
    const authToken = await getAuthToken('test-user');

    const response = await common
      .get('/health')
      .set({
        Authorization: authToken
      });


    expect(response.status).toBe(200);
    expect(response.body.healthy).toBeTruthy();
  });

  describe('Common Creation', () => {
    it('should not allow unauthorized requests', async () => {
      const response = await common
        .post('/create');

      expect(response.status).toBe(401);
    });

    it('should fail validation on invalid input', async () => {
      // Setup
      const authToken = await getAuthToken('test-user');

      const invalidContributionType = {
        ...validCommonCreationPayload,
        contributionType: 'something wrong'
      };

      // Act
      const response = await common
        .post('/create')
        .set({
          Authorization: authToken
        })
        .send(invalidCommonCreationPayload);

      const invalidContributionResponse = await common
        .post('/create')
        .set({
          Authorization: authToken
        })
        .send(invalidContributionType);

      // Assert
      expect(response.status).toBe(422);

      expect(response.body.errorCode).toBeDefined();
      expect(response.body.errorCode).toBe('ValidationError');

      expect(response.body.data.errors).toMatchSnapshot();

      expect(
        invalidContributionResponse.body.data.errors
          .some(x => x === 'contributionType must be one of the following values: one-time, monthly')
      ).toBeTruthy();

      console.log(response.body);
    });

    it('should create common successfully given valid data', async () => {
      // Setup
      const authToken = await getAuthToken('test-user');

      // Act
      const response = await common
        .post('/create')
        .set({
          Authorization: authToken
        })
        .send(validCommonCreationPayload);

      // Assert
      expect(response.status).toBe(200);

      expect(response.body.register).toBe('na');
      expect(response.body.members.length).toBe(1);
      expect(response.body.metadata.founderId).toBe('test-user');
    });
  });
});