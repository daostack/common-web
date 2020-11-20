// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import firebaseFunctionsTests from 'firebase-functions-test';
import { proposalsApp } from '../helpers/supertests';
import { createTestCommon } from '../helpers/createTestCommon';
import { createTestJoinRequest } from '../helpers/createTestProposal';
import { addProposal } from '@common/functions/dist/proposals/database/addProposal';
import { getTestAuthToken } from '../helpers/auth';

const votingEndpoint = '/create/vote';

const test = firebaseFunctionsTests({
  projectId: 'common-tests'
});

const data = (proposalId: string, outcome = 'approved') => ({
  "outcome": outcome,
  "proposalId": proposalId
});

describe('Proposal Related Cloud Functions', () => {
  afterAll(async () => {
    await test.cleanup();
  });

  it('should work', () => {
    expect(true).toBeTruthy();
  });

  describe('Voting on proposals', () => {
    it('should not allow not authorized users to vote', async() => {
      // Setup
      const common = await createTestCommon();
      const proposal = await createTestJoinRequest({ common });

      // Act
      const response = await proposalsApp
        .post(votingEndpoint)
        .send(data(proposal.id));

      expect(response.status).toBe(401);
      expect(response.body.errorCode).toBe('AuthenticationError');
    });


    it('should not allow non members to vote', async () => {
      // Setup
      const token = getTestAuthToken('voter');
      const common = await createTestCommon('commoner');
      const proposal = await createTestJoinRequest({ common });

      // Act
      const response = await proposalsApp
        .post('/create/vote')
        .send(data(proposal.id))
        .set({
          Authorization: token
        });

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.error?.includes('Cannot vote for proposals in commons that you are not member of')).toBeTruthy();
    });

    it('should not allow incorrect vote outcome', async () => {
      // Setup
      const token = getTestAuthToken('voter');
      const common = await createTestCommon('voter');
      const proposal = await createTestJoinRequest({ common });

      // Act
      const response = await proposalsApp
        .post('/create/vote')
        .send(data(proposal.id, 'rejeccct'))
        .set({
          Authorization: token
        });

      const response2 = await proposalsApp
        .post('/create/vote')
        .send(data(proposal.id, null))
        .set({
          Authorization: token
        });

      // Assert
      expect(response.status).toBe(422);
      expect(response2.status).toBe(422);
    });

    it('should be able to approve if member', async () => {
      // Setup
      const token = getTestAuthToken('voter');
      const common = await createTestCommon('voter');
      const proposal = await createTestJoinRequest({ common });

      // Act
      const response = await proposalsApp
        .post('/create/vote')
        .send(data(proposal.id, 'approved'))
        .set({
          Authorization: token
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully approved proposal!');
    });

    it('should be to reject if member', async () => {
      // Setup
      const token = getTestAuthToken('voter');
      const common = await createTestCommon('voter');
      const proposal = await createTestJoinRequest({ common });

      // Act
      const response = await proposalsApp
        .post('/create/vote')
        .send(data(proposal.id, 'rejected'))
        .set({
          Authorization: token
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully rejected proposal!');
    });

    it('should not allow more than one vote being casted',  async() => {
      // Setup
      const token = getTestAuthToken('voter');
      const common = await createTestCommon('voter');
      const proposal = await createTestJoinRequest({ common });

      // Act
      const response = await proposalsApp
        .post('/create/vote')
        .send(data(proposal.id, 'rejected'))
        .set({
          Authorization: token
        });

      const secondResponse = await proposalsApp
        .post('/create/vote')
        .send(data(proposal.id, 'approved'))
        .set({
          Authorization: token
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully rejected proposal!');

      expect(secondResponse.status).toBe(422);
      expect(secondResponse.body.error).not.toBe(null);
      expect(secondResponse.body.error.includes('Only one vote from one user is allowed on one proposal')).toBeTruthy();
    });
  });
});