import * as functions from 'firebase-functions';

import { env } from '../constants';
import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';

import { createCommon } from './business';
import * as triggers from './triggers';
import { commonDb } from './database';
import { deleteCommon } from './business/deleteCommon';

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

if (env.environment === 'staging' || env.environment === 'dev') {
  router.delete('/delete', async (req, res, next) => {
    await responseExecutor(
      async () => {
        logger.notice(`User ${req.user.uid} is trying to delete common with ID ${req.query.commonId}`);

        const common = await commonDb.get(req.query.commonId as string);

        return deleteCommon(common)
      }, {
        req,
        res,
        next,
        successMessage: 'Common deleted successfully'
      });
  });
}

export const commonsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));

export const commonTriggers = triggers;