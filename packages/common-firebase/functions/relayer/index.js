const functions = require('firebase-functions');
const Relayer = require('./relayer');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Utils = require('../util/util');
const {createWallet} = require('./createWallet');
const {requestToJoin} = require('./requestToJoin');
const {execTransaction} = require('./execTransaction');

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
  try {
    const data = await createWallet(req)
    res.send(JSON.stringify(data));
  } catch (err) {
    res.send(err.response.data);
  }
})

relayer.post('/requestToJoin', async (req, res) => {
  try {
    const data = await requestToJoin(req, res);
    res.send(JSON.stringify(data));
  } catch (err) {
    res.send(err.response && err.response.data || err);
  }
})

relayer.get('/addWhitleList', async (req, res) => {
  try {
    const idToken = req.header('idToken');
    const uid = await Utils.verifyId(idToken);
    const userData = await Utils.getUserById(uid);
    const address = userData.safeAddress
    const result = await Relayer.addProxyToWhitelist([address]);
    res.send(result.data);
  } catch (err) {
    const errDoc = { error: `${err}`, data: res.data, response: err.response}
    console.log(errDoc)
    res.status(500).send(errDoc)
  }
})

relayer.post('/execTransaction', async (req, res) => {
  try {
    const response = await execTransaction(req);
    res.send(response.data);
  } catch (err) {
    const errDoc = { error: `${err}`, data: res.data, response: err.response}
    console.log(errDoc)
    res.status(500).send(errDoc)
  }
})

exports.relayer = functions.runWith(runtimeOptions).https.onRequest(relayer);
