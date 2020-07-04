const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { updateDaos, updateDaoById, updateProposals, updateUsers, updateVotes, updateProposalById } = require('./ArcListener')
const { updateDAOBalance} = require("./updateDAOBalance")

const runtimeOptions = {
  timeoutSeconds: 540, // Maximum time 9 mins
 }

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
  try {
    const result = await updateDaos();
    const code = 200;
    res.status(code).send({message: `Updated DAOs successfully`, result});
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send({error: `Unable to update Daos: ${e}`});
  }

});

graphql.get('/update-dao-by-id', async (req, res) => {
  try {
    console.log(req.query);
    const { daoId } = req.query;
    const daoData = await updateDaoById(daoId, { retries: 1 });
    const code = 200;
    res.status(code).send({message: `Updated dao with id ${daoId}`, daoId, data: daoData});
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send({error: `Unable to update Dao: ${e}`, daoId: req.query.daoId});
  }

});

graphql.get('/update-proposals', async (req, res) => {
  try {
    const result = await updateProposals();
    const code = 200;
    res.status(code).send(`Updated ${result.length} proposals`);
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send({error: `Unable to update Proposals: ${e}`});
  }

});

graphql.get('/update-proposal-by-id', async (req, res) => {
  try {
    const { proposalId, retries } = req.query;
    const data = await updateProposalById(proposalId, { retries: retries || 0 });
    const code = 200;
    res.status(code).send({message: `Updated proposal ${proposalId}`, data });
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send({error: `Unable to update Proposal by id: ${e}`, proposalId: req.query.proposalId});
  }
});

graphql.get('/update-users', async (req, res) => {
  try {
    const result = await updateUsers();
    const code = 200;
    res.status(code).send(`Updated users successfully: ${result}`);
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send({error: `Unable to update users: ${e}`});
  }
});
graphql.get('/update-votes', async (req, res) => {
  try {
    const result = await updateVotes();
    const code = 200;
    res.status(code).send(`Updated votes successfully: ${result}`);
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send({error: `Unable to update votes: ${e}`});
  }
});

graphql.get('/update-dao-balance', async (req, res) => {
  const { daoId } = req.query;
  try {
    const data = await updateDAOBalance(daoId);
    const code = 200;
    res.status(code).send({message: `Updated balance of Common at ${daoId}`, data });
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send({error: `Unable to update Common balance ${e}`, query: req.query});
  }
});

exports.graphql = functions.runWith(runtimeOptions).https.onRequest(graphql);
