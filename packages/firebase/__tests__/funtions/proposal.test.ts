// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import firebaseFunctionsTests from 'firebase-functions-test';
import { v4 } from 'uuid';

import { getTestAuthToken } from '../helpers/auth';
import { proposalsApp } from '../helpers/supertests';
import { createTestCommon } from '../helpers/createTestCommon';

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
  funding: 50000,
  cardId: `test-card-id-for-common-${commonId}`
});

const validFundingData = (commonId: string) => ({
  commonId,
  description: 'I wanna be a part',
  amount: 50000,
  title: 'I need money'
});

const validJoinDataZeroContribution = (commonId: string) => ({
  commonId,
  description: 'I wanna be a part, but without paying',
  funding: 0,
  cardId: `test-card-id-for-common-${commonId}`
});

const invalidJoinDataZeroContribution = (commonId: string) => ({
  commonId,
  description: 'I wanna be a part, but pay less that $5',
  funding: 300,
  cardId: `test-card-id-for-common-${commonId}`
});

describe('Proposal Related Cloud Functions', () => {
  afterAll(async () => {
    await test.cleanup();
  });

  it('should work', () => {
    expect(true).toBeTruthy();
  });

  it('should be healthy', async () => {
    const authToken = await getTestAuthToken(v4());

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
      const authToken = await getTestAuthToken(v4());

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
      const userId = v4();

      // Setup
      const authToken = await getTestAuthToken(userId);
      const common = await createTestCommon(userId);

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
      const founderId = v4();
      const joinerId = v4();

      const authToken = await getTestAuthToken(joinerId);
      const common = await createTestCommon(founderId);

      // Act
      const response1 = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinData(common.id))
        .set({
          Authorization: authToken
        });

      const response2 = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinData(common.id))
        .set({
          Authorization: authToken
        });

      // Assert
      expect(response1.status).toBe(200);
      expect(response1.body.message).toBe('Join request successfully created!');
      expect(response1.body.proposerId).toBe(joinerId);

      expect(response2.status).toBe(400);
      expect(response2.body.error.includes('User with ongoing join request tried to create new one')).toBeTruthy();
    });

    it('should make join request with valid input in commons, that you are not member of', async () => {
      // Setup
      const joinerId = v4();
      const founderId = v4();

      const authToken = await getTestAuthToken(joinerId);
      const common = await createTestCommon(founderId);

      // Act
      const response = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinData(common.id))
        .set({
          Authorization: authToken
        });

      // Assert
      expect(response.body.message).toBe('Join request successfully created!');
      expect(response.body.proposerId).toBe(joinerId);
      expect(response.body.type).toBe('join');
      expect(response.body.commonId).toBe(common.id);
    });

    it('should make a join request when funding = 0 and 0 contribution is allowed', async () => {
      // Setup
      const joinerId = v4();
      const founderId = v4();

      const authToken = await getTestAuthToken(joinerId);
      const common = await createTestCommon(founderId);

      const response = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinDataZeroContribution(common.id))
        .set({
          Authorization: authToken
        });

      expect(response.body.message).toBe('Join request successfully created!');
      expect(response.body.proposerId).toBe(joinerId);
      expect(response.body.type).toBe('join');
      expect(response.body.commonId).toBe(common.id);

    });

    it('should not make a join request when 0 < funding < 5 and 0 contribution is allowed', async () => {
      // Setup
      const joinerId = v4();
      const founderId = v4();

      const authToken = await getTestAuthToken(joinerId);
      const common = await createTestCommon(founderId);

      const response = await proposalsApp
        .post(joinEndpoint)
        .send(invalidJoinDataZeroContribution(common.id))
        .set({
          Authorization: authToken
        });

      expect(response.body.error.includes(`The funding cannot be less than the minimum required funding`)).toBeTruthy();
      expect(response.body.errorCode).toBe('GenericError');
      expect(response.body.errorMessage).toBe('Your join request cannot be created, because the min fee to join is $65.00, but you provided $3.00');
      expect(response.status).toBe(400);
    });

    it('should not make a join request when funding = 0 and 0 contribution is not allowed', async () => {
      // Setup
      const joinerId = v4();
      const founderId = v4();

      const authToken = await getTestAuthToken(joinerId);
      const common = await createTestCommon(founderId, false); //@askAlexI if he's ok with that (having a second argument for zeroContribution) :)

      const response = await proposalsApp
        .post(joinEndpoint)
        .send(validJoinDataZeroContribution(common.id))
        .set({
          Authorization: authToken
        });

      expect(response.body.error.includes(`The funding cannot be less than the minimum required funding`)).toBeTruthy();
      expect(response.body.errorCode).toBe('GenericError');
      expect(response.body.errorMessage).toBe('Your join request cannot be created, because the min fee to join is $65.00, but you provided $0.00');
      expect(response.status).toBe(400);
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
      const funderId = v4();
      const founderId = v4()

      const common = await createTestCommon(founderId);
      const authToken = await getTestAuthToken(funderId);

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
      const userId = v4();

      const authToken = await getTestAuthToken(userId);

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
      const userId = v4();

      const common = await createTestCommon(userId);
      const authToken = await getTestAuthToken(userId);

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

      expect(response.body.proposerId).toBe(userId);
      expect(response.body.type).toBe('fundingRequest');
      expect(response.body.state).toBe('countdown');
    });
  });
});