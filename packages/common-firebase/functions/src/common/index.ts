import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';

import { createCommon } from './business';
import * as triggers from './triggers';

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

export const commonsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));

export const commonTriggers = triggers;