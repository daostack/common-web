import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';

const CURRENT_VERSION = '1.9';
const OLDEST_SUPPORTED_VERSION = '1.9';

const metadataRouter = commonRouter();

metadataRouter.get('/app', (req, res) => {
  res
    .status(200)
    .send({
      currentVersion: CURRENT_VERSION,
      oldestSupportedVersion: OLDEST_SUPPORTED_VERSION
    });
});

export const metadataApp = functions
  .runWith({
    timeoutSeconds: 540
  })
  .https.onRequest(commonApp(metadataRouter, {
    unauthenticatedRoutes: [
      '/app'
    ]
  }));
