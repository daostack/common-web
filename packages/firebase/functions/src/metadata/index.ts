import * as functions from 'firebase-functions';

import { env } from '../constants';
import { commonApp, commonRouter } from '../util';
import { addJoinedAtDateToAllCommonMembers } from '../util/scripts/addJoinedAtDate';

const metadataRouter = commonRouter();

metadataRouter.get('/app', (req, res) => {
  res
    .status(200)
    .send({
      currentVersion: env.metadata.app.currentVersion || '0.1', // Add really small version if something goes bad so the app does not lock out users
      oldestSupportedVersion: env.metadata.app.currentVersion || '0.1'
    });
});

metadataRouter.get('/headers', async (req, res) => {
  res.send({
    headers: JSON.stringify(req.headers),
    rawHeaders: JSON.stringify(req.rawHeaders)
  });
});

metadataRouter.get('/addJoinedAt', async (req, res) => {
  await addJoinedAtDateToAllCommonMembers();

  res.send('done!');
})

export const metadataApp = functions
  .runWith({
    timeoutSeconds: 540
  })
  .https.onRequest(commonApp(metadataRouter, {
    unauthenticatedRoutes: [
      '/app',
      '/headers',
      '/addJoinedAt'
    ]
  }));
