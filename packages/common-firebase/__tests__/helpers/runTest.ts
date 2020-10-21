import * as functions from '../../functions/src';
import firebaseFunctionsTests from 'firebase-functions-test';

import { FeaturesList } from 'firebase-functions-test/lib/features';

const test = firebaseFunctionsTests({
  projectId: "common-tests"
});

export const runTest = (testsFunc: (functions: any , test: FeaturesList) => any): void => {
  describe('Cloud Functions', () => {
    afterAll(async () => {
      // Do other cleanup tasks.
      await test.cleanup();
    });

    testsFunc(functions, test);

    afterAll(() => {
      // If after 5 seconds after the tests have executed
      // the process has not finished quit it
      setTimeout(() => process.exit(0), 5000)
    });
  });
}