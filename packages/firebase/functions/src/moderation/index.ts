import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';
import { hideContent } from './business/hideContent'
import { showContent } from './business/showContent'

const router = commonRouter();

router.post('/hide', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await hideContent({
        ...req.body,
        userId: req.user.uid
      });
    }, {
      req,
      res,
      next,
      successMessage: 'Permission added successfully!'
    });
});

router.post('/show', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await showContent({
        ...req.body,
        userId: req.user.uid
      });
    }, {
      req,
      res,
      next,
      successMessage: 'Permission added successfully!'
    });
});

export const moderationApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));