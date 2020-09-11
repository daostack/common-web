const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { getPublicSettings } = require('./Settings');

const { updateDaos, updateDaoById } = require('./Dao');
const { updateProposals, updateProposalById } = require('./Proposal');
const { updateUsers } = require('./User');
const { updateVotes } = require('./Vote');

const { updateDAOBalance } = require('../db/daoDbService');

const { responseExecutor } = require('../util/responseExecutor');


const runtimeOptions = {
  timeoutSeconds: 540 // Maximum time 9 mins
};

const graphql = express();

// Automatically allow cross-origin requests
graphql.use(bodyParser.json());       // to support JSON-encoded bodies
graphql.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
graphql.use(express.json());       // to support JSON-encoded bodies
graphql.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
graphql.use(cors({ origin: true }));

graphql.get('/update-daos', async (req, res) => {
  responseExecutor(
    async () => {
      return await updateDaos();
    },
    {
      req,
      res,
      successMessage: `Updated DAOs successfully!`,
      errorMessage: `Unable to update Daos!`
    }
  );

});

graphql.get('/update-dao-by-id', async (req, res) => {
  const { daoId, retries } = req.query;
  responseExecutor(
    async () => {
      return await updateDaoById(daoId, { retries: retries || 0 });
    },
    {
      req,
      res,
      successMessage: `Updated dao with id ${daoId}!`,
      errorMessage: `Unable to update Dao with id ${daoId}!`
    }
  );
});

graphql.get('/update-proposals', async (req, res) => {
  responseExecutor(
    async () => {
      return await updateProposals();
    },
    {
      req,
      res,
      successMessage: `Updated proposals!`,
      errorMessage: `Unable to update Proposals!`
    }
  );
});

graphql.get('/update-proposal-by-id', async (req, res) => {
  const { proposalId, retries, blockNumber } = req.query;
  responseExecutor(
    async () => {
      return await updateProposalById(proposalId, { retries: retries || 0 }, blockNumber);
    },
    {
      req,
      res,
      successMessage: `Updated proposal ${proposalId}!`,
      errorMessage: `Unable to update Proposal by id: ${proposalId}!`
    }
  );
});

graphql.get('/update-users', async (req, res) => {
  responseExecutor(
    async () => {
      return await updateUsers();
    },
    {
      req,
      res,
      successMessage: `Updated users successfully!`,
      errorMessage: `Unable to update users!`
    }
  );
});
graphql.get('/update-votes', async (req, res) => {
  responseExecutor(
    async () => {
      return await updateVotes();
    },
    {
      req,
      res,
      successMessage: `Updated votes successfully!`,
      errorMessage: `Unable to update votes!`
    }
  );
});

graphql.get('/update-dao-balance', async (req, res) => {
  const { daoId } = req.query;
  responseExecutor(
    async () => {
      return await updateDAOBalance(daoId);
    },
    {
      req,
      res,
      successMessage: `Updated balance of Common at ${daoId}!`,
      errorMessage: `Unable to update Common balance!`
    }
  );
});

graphql.get('/settings', async (req, res) => {
  await responseExecutor(() =>  getPublicSettings(req), {
    req,
    res,
    successMessage: 'Setting successfully acquired!',
    errorMessage: 'An error occurred while trying to acquire the settingss'
  });
});

exports.graphql = functions.runWith(runtimeOptions).https.onRequest(graphql);
