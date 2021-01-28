import * as functions from 'firebase-functions';
import { commonDb } from '../common/database';

import { env } from '../constants';
import { commonApp, commonRouter } from '../util';

const metadataRouter = commonRouter();

metadataRouter.get('/app', (req, res) => {
  res
    .status(200)
    .send({
      currentVersion: env.metadata.app.currentVersion || '0.1', // Add really small version if something goes bad so the app does not lock out users
      oldestSupportedVersion: env.metadata.app.currentVersion || '0.1'
    });
});

metadataRouter.get('/common', async (req, res) => {
  res.send(await commonDb.get(req.query.commonId as string));
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
