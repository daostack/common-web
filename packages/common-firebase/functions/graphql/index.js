const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { updateDaos, updateDaoById, updateProposals, updateUsers, updateVotes, updateProposalById } = require('./ArcListener')

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
    res.status(code).send(`Updated DAOs successfully: ${result}`);
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send(new Error(`Unable to update DAOs: ${e}`));
  }

});

graphql.get('/update-dao-by-id', async (req, res) => {
  try {
    console.log(req.query);
    const { daoId } = req.query;
    const result = await updateDaoById(daoId, true);
    const code = 200;
    res.status(code).send(`Updated dao with id ${daoId}`);
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send(new Error(`Unable to update Dao: ${e}`));
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
    res.status(code).send(new Error(`Unable to update Proposals: ${e}`));
  }

});

graphql.get('/update-proposal-by-id', async (req, res) => {
  try {
    const { proposalId } = req.query;
    const result = await updateProposalById(proposalId);
    const code = 200;
    res.status(code).send(`Updated ${result.length} proposals`);
  } catch (e) {
    const code = 500;
    console.log(e)
    res.status(code).send(new Error(`Unable to update Proposals: ${e}`));
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
    res.status(code).send(new Error(`Unable to update users: ${e}`));
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
    res.status(code).send(new Error(`Unable to update votes: ${e}`));
  }
});

exports.graphql = functions.runWith(runtimeOptions).https.onRequest(graphql);
