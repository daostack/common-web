// @ts-ignore
import firebaseFunctionsTests from 'firebase-functions-test';
import { v4 } from 'uuid';

import { getAuthToken } from '../helpers/auth';
import { proposalsApp } from '../helpers/supertests';

const joinEndpoint = '/create/join';
const fundingEndpoint = '/create/funding';

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
});