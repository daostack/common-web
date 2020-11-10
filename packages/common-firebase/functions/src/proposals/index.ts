import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { runtimeOptions } from '../constants';
import { responseExecutor } from '../util/responseExecutor';
import { createJoinRequest } from './business/createJoinRequest';
import { createFundingRequest } from './business/createFundingRequest';
import { createVote } from './business/votes/createVote';

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

router.post('/create/funding', async (req, res, next) => {
  await responseExecutor(async () => {
    return createFundingRequest({
      ...req.body,
      proposerId: req.user.uid
    });
  }, {
    req,
    res,
    next,
    successMessage: 'Funding request successfully created!'
  });
});

router.post('/create/vote', async (req, res, next) => {
  await responseExecutor(async () => {
    return createVote({
      voterId: req.user.uid,
      proposalId: req.body.proposalId,
      outcome: req.body.outcome
    });
  }, {
    req,
    res,
    next,
    successMessage: 'Funding request successfully created!'
  });
});

export const proposalsApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));