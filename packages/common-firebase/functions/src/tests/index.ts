import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util/commonApp';

const runtimeOptions = {
  timeoutSeconds: 540
};

const router = commonRouter()


export const tests = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));



