import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';

const router = commonRouter();

export const commonsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));