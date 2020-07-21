const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const abi = require('./abi.json');
const Relayer = require('./Relayer');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ethers = require('ethers');
const { env } = require('../env');
const Utils = require('../util/util');
const {createWallet} = require('./createWallet');
const {requestToJoin} = require('./requestToJoin');

const runtimeOptions = {
  timeoutSeconds: 540, // Maximum time 9 mins
}

// create an Arc instance
const relayer = express();

// Automatically allow cross-origin requests
relayer.use(bodyParser.json());       // to support JSON-encoded bodies
relayer.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
relayer.use(express.json());       // to support JSON-encoded bodies
relayer.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
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

/* ------------------- Old Version ----------------- */

relayer.get('/create2Wallet', async (req, res) => {
  try {
    
    // TODO: Change this with calculate address
    // SaltNonce need to change
    const idToken = req.header('idToken');
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    const userData = await admin.firestore().collection('users').doc(uid).get().then(doc => { return doc.data() })
    const address = userData.ethereumAddress
    const options = { headers: { 'x-api-key': env.biconomy.apiKey, 'Content-Type': 'relayerlication/json' } }
    const iface = new ethers.utils.Interface(abi.MasterCopy);
    const zeroAddress = `0x${'0'.repeat(40)}`;
    const encodedData = iface.functions.setup.encode([
      [address],
      1,
      zeroAddress,
      '0x',
      zeroAddress,
      zeroAddress,
      '0x',
      zeroAddress,
    ]);
    const nonceSalt = Math.floor(Math.random() * 10000000000);
    const data = {
      'apiId': env.biconomy.create2Proxy,
      'to': env.biconomy.proxyFactory,
      'from': address,
      'params': [env.biconomy.masterCopy, encodedData, nonceSalt]
    }
    
    const testAddress = ethers.utils.getContractAddress({ from: env.biconomy.proxyFactory, nonce: nonceSalt })
    axios.post('https://api.biconomy.io/api/v2/meta-tx/native', data, options)
    .then(receive => {
      let object = Object.assign(receive.data, { address: testAddress, nonce: nonceSalt })
      res.send(object);
    })
    .catch(err => {
      res.send(err);
    })
  } catch (err) {
    res.send(err.response.data);
  }
})

relayer.post('/execTransaction', async (req, res) => {
  try {
    console.log('execTransaction');
    const { to, value, data, signature, idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    const userData = await admin.firestore().collection('users').doc(uid).get().then(doc => { return doc.data() })
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress
    console.log('safeAddress', safeAddress);
    console.log('ethereumAddress', ethereumAddress);
    await Relayer.addAddressToWhitelist([to]);
    const response = await Relayer.execTransaction(safeAddress, ethereumAddress, to, value, data, signature)
    // TODO: Once it failed, it will send detail to client which have apiKey
    res.send(response.data);
  } catch (err) {
    const errDoc = { error: `${err}`, data: res.data, response: err.response}
    console.log(errDoc)
    res.status(500).send(errDoc)
  }
})

exports.relayer = functions.runWith(runtimeOptions).https.onRequest(relayer);
