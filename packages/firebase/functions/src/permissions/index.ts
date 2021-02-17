import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';

import { addPermission } from './business';

const router = commonRouter();

router.post('/add-permission', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await addPermission({
        ...req.body,
        requestByUserId: req.user.uid
      });
    }, {
      req,
      res,
      next,
      successMessage: 'Permission added successfully!'
    });
});

export const permissionApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));