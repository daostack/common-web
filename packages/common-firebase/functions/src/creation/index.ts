import * as functions from 'firebase-functions';

import { commonApp } from '../util/commonApp';
import { responseCreateExecutor, responseExecutor } from '../util/responseExecutor';
import { createCommon, createCommonTransaction } from './common';
import { createFundingProposal, createFundingProposalTransaction } from './fundingProposal';
import { createRequestToJoin, createRequestToJoinTransaction } from './requestToJoin';
import { createVoteProposalTransaction, voteProposal } from './voteProposal';


const runtimeOptions = {
  timeoutSeconds: 540, // Maximum time 9 mins
}

const createApp = commonApp();

createApp.post('/createCommonTransaction', async (req, res) => {
  await responseCreateExecutor(
    async () => {
      return await createCommonTransaction(req)
    },
    {
      req,
      res,
      successMessage: `Create common transaction successfully!`
    }
  );
})

createApp.post('/createCommon', async (req, res) => {
  await responseExecutor(
    async () => {
      return await createCommon(req);
    },
    {
      req,
      res,
      successMessage: `Common Created successfully!`,
    }
  );
})

createApp.post('/createRequestToJoinTransaction', async (req, res) => {
  await responseCreateExecutor(
    async () => {
      return await createRequestToJoinTransaction(req);
    },
    {
      req,
      res,
      successMessage: `Create requestToJoin transaction successfully!`,
    }
  );
})

createApp.post('/createRequestToJoin', async (req, res) => {
  await responseExecutor(
    async () => {
      return await createRequestToJoin(req);
    },
    {
      req,
      res,
      successMessage: `Request to join successfully!`,
    }
  );
})

  createApp.post('/createFundingProposalTransaction', async (req, res) => {
    await responseCreateExecutor(
      async () => {
        return await createFundingProposalTransaction(req);
      },
      {
        req,
        res,
        successMessage: `Create funding proposal transaction successfully!!`,
      }
    );
})
  
  createApp.post('/createFundingProposal', async (req, res) => {
    await responseExecutor(
      async () => {
        return await createFundingProposal(req);
      },
      {
        req,
        res,
        successMessage: `Create funding proposal successfully!`,
      }
    );
})

  createApp.post('/createVoteProposalTransaction', async (req, res) => {
    await responseCreateExecutor(
      async () => {
        return await createVoteProposalTransaction(req);
      },
      {
        req,
        res,
        successMessage: `Create a vote proposal transaction successfully!`,
      }
    );
  })
  
  createApp.post('/votePropoal', async (req, res) => {
    await responseExecutor(
      async () => {
        return await voteProposal(req);
      },
      {
        req,
        res,
        successMessage: `Vote for the proposal successfully!`,
      }
    );
  })

export const create = functions
  .runWith(runtimeOptions)
  .https.onRequest(createApp);