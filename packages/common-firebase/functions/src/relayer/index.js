const functions = require('firebase-functions');
const Relayer = require('./relayer');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Utils } = require('../util/util');
const {createWallet} = require('./createWallet');
const {createRequestToJoin} = require('./createRequestToJoin');
const { execTransaction } = require('./util/execTransaction');

const { responseExecutor } = require('../util/responseExecutor');

const runtimeOptions = {
  timeoutSeconds: 540, // Maximum time 9 mins
}

// create an Arc instance
const relayer = express();

// Automatically allow cross-origin requests
relayer.use(bodyParser.json());
relayer.use(bodyParser.urlencoded({
  extended: true
}));
relayer.use(express.json());
relayer.use(express.urlencoded({ extended: true }));
relayer.use(cors({ origin: true }));

relayer.get('/createWallet', async (req, res) => {
  await responseExecutor(
    async () => {
      return await createWallet(req);
    },
    {
      req,
      res,
      successMessage: `Created wallet!`,
      errorMessage: `Unable to create a wallet!`
    }
  );
})

relayer.post('/requestToJoin', async (req, res) => {
  await responseExecutor(
    async () => {
      return await createRequestToJoin(req, res);
    },
    {
      req,
      res,
      successMessage: `Created request to join!`,
      errorMessage: `Unable to create a request to join!`
    }
  );
})

relayer.get('/addWhitleList', async (req, res) => {
  // try {
  //   const idToken = req.header('idToken');
  //   const uid = await Utils.verifyId(idToken);
  //   const userData = await Utils.getUserById(uid);
  //   const address = userData.safeAddress
  //   const result = await Relayer.addProxyToWhitelist([address]);
  //   res.send(result.data);
  // } catch (err) {
  //   const errDoc = { error: `${err}`, data: res.data, response: err.response}
  //   console.error(errDoc)
  //   res.status(500).send(errDoc)
  // }

  await responseExecutor(
    async () => {
      const idToken = req.header('idToken');
      const uid = await Utils.verifyId(idToken);
      const userData = await Utils.getUserById(uid);
      const address = userData.safeAddress
      return await Relayer.addProxyToWhitelist([address]);
    },
    {
      req,
      res,
      successMessage: `Added white list!`,
      errorMessage: `Unable to add white list!`
    }
  );
})

relayer.post('/execTransaction', async (req, res) => {
  // try {
  //   const data = await execTransaction(req);
  //   res.send(data);
  // } catch (err) {
  //   const errDoc = { error: `${err}`, data: res.data, response: err.response}
  //   console.error(errDoc)
  //   res.status(500).send(errDoc)
  // }

  await responseExecutor(
    async () => {
      return await execTransaction(req);
    },
    {
      req,
      res,
      successMessage: `Executed transaction!`,
      errorMessage: `Unable to execute a transaction!`
    }
  );
})

exports.relayer = functions.runWith(runtimeOptions).https.onRequest(relayer);
