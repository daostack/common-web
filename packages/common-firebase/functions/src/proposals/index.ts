import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';
import { createJoinRequest } from './business/createJoinRequest';

const router = commonRouter();

router.post('/create/join', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await createJoinRequest({
        ...req.body,
        userId: req.user.uid
      });
    }, {
      req,
      res,
      next,
      successMessage: 'Join request successfully created!'
    });
});

export const proposalsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));