// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import firebaseFunctionsTests from 'firebase-functions-test';
import { v4 } from 'uuid';

import { getAuthToken } from '../helpers/auth';
import { proposalsApp } from '../helpers/supertests';

const votingEndpoint = '/create/vote';

const test = firebaseFunctionsTests({
  projectId: 'common-tests'
});

describe('Proposal Related Cloud Functions', () => {
  afterAll(async () => {
    await test.cleanup();
  });

  it('should work', () => {
    expect(true).toBeTruthy();
  });

  describe('Voting on proposals', () => {
    it('should not allow not authorized users to vote', () => {
      // @todo
    });


    it('should not allow non members to vote', () => {
      // @todo
    });

    it('should not allow incorrect vote outcome', () => {
      // @todo
    });

    it('should be to approve if member', () => {
      // @todo
    });

    it('should be to reject if member', () => {
      // @todo
    });

    it('should not allow more than one vote being casted', () => {
      // @todo
    });
  });
});