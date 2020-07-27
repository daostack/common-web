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
    res.status(200).send({message: `Updated DAOs successfully`, result});
  } catch (e) {
    console.log(500)
    res.status(500).send({error: `Unable to update Daos: ${e}`, query: req.query});
  }

});

graphql.get('/update-dao-by-id', async (req, res) => {
  try {
    console.log(req.query);
    const { daoId, retries } = req.query;
    const daoData = await updateDaoById(daoId, { retries: retries || 0  });
    res.status(200).send({message: `Updated dao with id ${daoId}`, daoId, data: daoData});
  } catch (e) {
    console.log(e)
    res.status(500).send({error: `Unable to update Dao: ${e}`, query: req.query});
  }

});

graphql.get('/update-proposals', async (req, res) => {
  try {
    const {docs, notUpdated} = await updateProposals();
    res.status(200).send(`Updated ${docs.length} proposals. Skipped ${notUpdated} due to old data version.`);
  } catch (e) {
    console.log(e)
    res.status(500).send({error: `Unable to update Proposals: ${e}`, query: req.query});
  }

});

graphql.get('/update-proposal-by-id', async (req, res) => {
  try {
    const { proposalId, retries } = req.query;
    const data = await updateProposalById(proposalId, { retries: retries || 0 });
    res.status(200).send({message: `Updated proposal ${proposalId}`, data });
  } catch (e) {
    console.log(e)
    res.status(500).send({error: `Unable to update Proposal by id: ${e.message ? e.message : e}`, query: req.query});
  }
});

graphql.get('/update-users', async (req, res) => {
  try {
    const result = await updateUsers();
    res.status(200).send(`Updated users successfully: ${result}`);
  } catch (e) {
    console.log(e)
    res.status(500).send({error: `Unable to update users: ${e}`, query: req.query});
  }
});
graphql.get('/update-votes', async (req, res) => {
  try {
    const result = await updateVotes();
    res.status(200).send(`Updated votes successfully: ${result}`);
  } catch (e) {
    console.log(e)
    res.status(500).send({error: `Unable to update votes: ${e}`, query: req.query});
  }
});

graphql.get('/update-dao-balance', async (req, res) => {
  const { daoId } = req.query;
  try {
    const data = await updateDAOBalance(daoId);
    res.status(200).send({message: `Updated balance of Common at ${daoId}`, data });
  } catch (e) {
    console.log(e)
    res.status(500).send({error: `Unable to update Common balance ${e}`, query: req.query});
  }
});

exports.graphql = functions.runWith(runtimeOptions).https.onRequest(graphql);
