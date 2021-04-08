// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import firebaseFunctionsTests from 'firebase-functions-test';

import { getTestAuthToken } from '../helpers/auth';
import { commonApp } from '../helpers/supertests';

const test = firebaseFunctionsTests({
  projectId: 'common-tests'
});

const invalidCommonCreationPayload = {
  name: 'Hello, I\'m a test',
  description: 'I should not be created tho as I\'m incomplete'
};

const validCommonCreationPayload = {
  name: 'Common Test',
  image: 'https://llandscapes-10674.kxcdn.com/wp-content/uploads/2019/07/lighting.jpg',
  byline: 'basically im long byline',
  description: 'hey there, am i descriptive',
  contributionType: 'one-time',
  contributionAmount: 6500,
  zeroContribution: true,
};

describe('Common Related Cloud Functions', () => {
  afterAll(async () => {
    await test.cleanup();
  });

  it('should work', () => {
    expect(true).toBeTruthy();
  });

  it('should be healthy', async () => {
    const authToken = await getTestAuthToken('test-user');

    const response = await commonApp
      .get('/health')
      .set({
        Authorization: authToken
      });


    expect(response.status).toBe(200);
    expect(response.body.healthy).toBeTruthy();
  });

  describe('Common Creation', () => {
    it('should not allow unauthorized requests', async () => {
      const response = await commonApp
        .post('/create');

      expect(response.status).toBe(401);
    });

    it('should fail validation on invalid input', async () => {
      // Setup
      const authToken = await getTestAuthToken('test-user');

      const invalidContributionType = {
        ...validCommonCreationPayload,
        contributionType: 'something wrong'
      };

      // Act
      const response = await commonApp
        .post('/create')
        .set({
          Authorization: authToken
        })
        .send(invalidCommonCreationPayload);

      const invalidContributionResponse = await commonApp
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
    });

    it('should create common successfully given valid data', async () => {
      // Setup
      const authToken = await getTestAuthToken('test-user');

      // Act
      const response = await commonApp
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