import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';
import { getAuthToken } from '../util/getAuthToken';

import { createCommon } from './business';

const router = commonRouter();

router.post('/create', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await createCommon({
        ...req.body,
        userId: req.user.uid
      });
    }, {
      req,
      res,
      next,
      successMessage: 'Common created successfully'
    });
});

// @remark If I have pushed this to the PR hit me up. It SHOULD NOT be included
router.get('/get-token', async (req, res) => {
  const token = await getAuthToken('H5ZkcKBX5eXXNyBiPaph8EHCiax2');

  res.send(token);
});

router.get('/me', async (req, res) => {
  res.send(req.user);
})

export const commonsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));