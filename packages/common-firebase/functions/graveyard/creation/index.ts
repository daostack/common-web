import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util/commonApp';
import { responseCreateExecutor, responseExecutor } from '../util/responseExecutor';
import { createCommon, createCommonTransaction } from './common';
import { createFundingProposal, createFundingProposalTransaction } from './fundingProposal';
import { createRequestToJoin, createRequestToJoinTransaction } from './requestToJoin';
import { createVoteProposalTransaction, voteProposal } from './voteProposal';


const runtimeOptions = {
  timeoutSeconds: 540 // Maximum time 9 mins
};

const router = commonRouter();

router.post('/createCommonTransaction', async (req, res, next) => {
  await responseCreateExecutor(
    async () => {
      return await createCommonTransaction(req);
    },
    {
      req,
      res,
      next,
      successMessage: `Create common transaction successfully!`
    }
  );
});

router.post('/createCommon', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await createCommon(req);
    },
    {
      req,
      res,
      next,
      successMessage: `Common Created successfully!`
    }
  );
});

router.post('/createRequestToJoinTransaction', async (req, res, next) => {
  await responseCreateExecutor(
    async () => {
      return await createRequestToJoinTransaction(req);
    },
    {
      req,
      res,
      next,
      successMessage: `Create requestToJoin transaction successfully!`
    }
  );
});

router.post('/createRequestToJoin', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await createRequestToJoin(req);
    },
    {
      req,
      res,
      next,
      successMessage: `Request to join successfully!`
    }
  );
});

router.post('/createFundingProposalTransaction', async (req, res, next) => {
  await responseCreateExecutor(
    async () => {
      return await createFundingProposalTransaction(req);
    },
    {
      req,
      res,
      next,
      successMessage: `Create funding proposal transaction successfully!!`
    }
  );
});

router.post('/createFundingProposal', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await createFundingProposal(req);
    },
    {
      req,
      res,
      next,
      successMessage: `Create funding proposal successfully!`
    }
  );
});

router.post('/createVoteProposalTransaction', async (req, res, next) => {
  await responseCreateExecutor(
    async () => {
      return await createVoteProposalTransaction(req);
    },
    {
      req,
      res,
      next,
      successMessage: `Create a vote proposal transaction successfully!`
    }
  );
});

router.post('/votePropoal', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await voteProposal(req);
    },
    {
      req,
      res,
      next,
      successMessage: `Vote for the proposal successfully!`
    }
  );
});

export const createApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router));
