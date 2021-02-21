import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';
import { reportContent } from './business/reportContent';
import { showContent } from './business/showContent';
import { hideContent } from './business/hideContent';

const router = commonRouter();

router.post('/report', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await reportContent({
        ...req.body,
        userId: req.user.uid
      });
    }, {
      req,
      res,
      next,
      successMessage: 'Your report was accepted'
    });
});

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
      successMessage: `Your ${req.body.type} was successfully hidden`
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
      successMessage: 'Content is now visible'
    });
});

export const moderationApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));