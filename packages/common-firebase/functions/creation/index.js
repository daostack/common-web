const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { responseExecutor, responseCreateExecutor } = require('../util/responseExecutor');
const { createCommon, createCommonTransaction } = require('./Common')
const { createRequestToJoinTransaction, createRequestToJoin  } = require('./RequestToJoin')
const { createVoteProposalTransaction, voteProposal  } = require('./VoteProposal')
const { createFundingProposalTransaction, createFundingProposal } = require('./FundingProposal');

const runtimeOptions = {
  timeoutSeconds: 540, // Maximum time 9 mins
}

const create = express();
create.use(bodyParser.json());
create.use(bodyParser.urlencoded({
  extended: true
}));
create.use(express.json());
create.use(express.urlencoded({ extended: true }));
create.use(cors({ origin: true }));

create.post('/createCommonTransaction', async (req, res) => {
  responseCreateExecutor(
    async () => {
      return await createCommonTransaction(req)
    },
    {
      req,
      res,
      successMessage: `Create common transaction successfully!`,
      errorMessage: `Unable to create a common transaction`
    }
  );
})

create.post('/createCommon', async (req, res) => {
  responseExecutor(
    async () => {
      return await createCommon(req);
    },
    {
      req,
      res,
      successMessage: `Common Created successfully!`,
      errorMessage: `Unable to create common!`
    }
  );
})

create.post('/createRequestToJoinTransaction', async (req, res) => {
  responseCreateExecutor(
    async () => {
      return await createRequestToJoinTransaction(req);
    },
    {
      req,
      res,
      successMessage: `Create requestToJoin transaction successfully!`,
      errorMessage: `Unable to create a request to join transaction!`
    }
  );
})

create.post('/createRequestToJoin', async (req, res) => {
  responseExecutor(
    async () => {
      return await createRequestToJoin(req);
    },
    {
      req,
      res,
      successMessage: `Request to join successfully!`,
      errorMessage: `Unable to create a request to join!`
    }
  );
})

  create.post('/createFundingProposalTransaction', async (req, res) => {
    responseCreateExecutor(
      async () => {
        return await createFundingProposalTransaction(req);
      },
      {
        req,
        res,
        successMessage: `Create funding proposal transaction successfully!!`,
        errorMessage: `Unable to create a funding proposal transaction`
      }
    );
})
  
  create.post('/createFundingProposal', async (req, res) => {
    responseExecutor(
      async () => {
        return await createFundingProposal(req);
      },
      {
        req,
        res,
        successMessage: `Create funding proposal successfully!`,
        errorMessage: `Unable to create a funding proposal !`
      }
    );
})

  create.post('/createVoteProposalTransaction', async (req, res) => {
    responseCreateExecutor(
      async () => {
        return await createVoteProposalTransaction(req);
      },
      {
        req,
        res,
        successMessage: `Create a vote proposal transaction successfully!`,
        errorMessage: `Unable to create vote transaction!`
      }
    );
  })
  
  create.post('/votePropoal', async (req, res) => {
    responseExecutor(
      async () => {
        return await voteProposal(req);
      },
      {
        req,
        res,
        successMessage: `Vote for the proposal successfully!`,
        errorMessage: `Unable to vote for a proposal !`
      }
    );
  })

exports.create = functions.runWith(runtimeOptions).https.onRequest(create);