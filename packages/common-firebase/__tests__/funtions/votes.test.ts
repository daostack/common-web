import supertest from 'supertest';
import firebaseFunctionsTests from 'firebase-functions-test';

import * as functions from '../../functions/src';


const test = firebaseFunctionsTests({
  projectId: 'common-tests'
});

describe('Proposal Related Cloud Functions', () => {
  afterAll(async () => {
    await test.cleanup();
  });


});