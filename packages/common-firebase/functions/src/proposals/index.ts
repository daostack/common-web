import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';
import { createJoinRequest } from './business/createJoinRequest';
import { IProposalEntity } from './type';

const router = commonRouter();

router.post('/create/join', async (req, res, next) => {
  await responseExecutor(
    async () => {
      const userId = '@todo Get the real user id';

      return await createJoinRequest({
        ...req.body,
        userId
      });
    }, {
      req,
      res,
      next,
      successMessage: 'Join request successfully created!'
    });
});

const dist = (propo: IProposalEntity) => {
  if (propo.type === 'fundingRequest') {
    propo.join
  }
}


export const proposalsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));