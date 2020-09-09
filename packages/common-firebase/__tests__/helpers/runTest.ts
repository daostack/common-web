import * as sinon from 'sinon';
import * as admin from 'firebase-admin';
import functionsTest from 'firebase-functions-test';

const test = functionsTest();

export const runTest = (testsFunc: (functions: any) => any): void => {
  describe('Cloud Functions', () => {
    let functions, adminInitStub;

    beforeAll(() => {
      adminInitStub = sinon.stub(admin, 'initializeApp');
      functions = require('@functions')
    });

    afterAll(() => {
      // If after 5 seconds after the tests have executed the proccess has not finished quit it
      setTimeout(() => process.exit(), 5000)

      // Restore admin.initializeApp() to its original method.
      adminInitStub.restore();

      // Do other cleanup tasks.
      test.cleanup();
    });

    testsFunc(functions);
  });
}