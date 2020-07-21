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
const { provider } = require('../settings')
const { updateProposalById, updateDaoById } = require('../graphql/ArcListener');
const { cancelPreauthorizedPayment } = require('../mangopay/mangopay');

const createWallet = require('./createWallet');
const requestToJoin = require('./requestToJoin');
const setAllowance = require('./setAllowance');

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
    setAllowance(req, res);
    res.send(JSON.stringify(data));
  } catch (err) {
    res.send(err.response.data);
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

relayer.get('/addWhitleList', async (req, res) => {
  try {
    const idToken = req.header('idToken');
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    const userData = await admin.firestore().collection('users').doc(uid).get().then(doc => { return doc.data() })
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

relayer.post('/v1/requestToJoin', async (req, res) => {
  try {
    const {
      idToken,
      commonTx, // This is the signed transaction to set the allowance. TODO: rename this param to approveCommonTokenTx
      pluginTx, // This is the signed transacxtion to create the proposal. TODO: rename tis param to createProposalTx
      funding,
      preAuthId
    } = req.body;
    // const {to, value, data, signature, idToken, plugin} = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    let userData = await admin.firestore().collection('users').doc(uid).get().then(doc => { return doc.data() })
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress
    

    if (preAuthId) {      
      // TODO: replace with estimate gas
      const OVERRIDES = {
        gasLimit: 10000000,
        gasPrice: 15000000000,
      };
      
      let minter = new ethers.Wallet(env.commonInfo.pk, provider);
      let contract = new ethers.Contract(env.commonInfo.commonToken, abi.CommonToken, minter);
      // TODO: fix the bug here: this must be the amount the user is actually paying!!!
      let tx = await contract.mint(safeAddress, funding, OVERRIDES); // Amount is USD * 100, so the exact token number
      // TODO: we probably want to send this transaction through the relayer (?)
      let receipt = await tx.wait();
      
      if (!receipt) {
        res.status(500).send({ error: 'Mint Token failed', errorCode: 101 })
      }

      let allowance = await contract.allowance(safeAddress, pluginTx.to);
      
      // If allowance is 0.0, we need approve the allowance
      // TODO: we should check here for allowance > amounttopay
      if (allowance.isZero()) {
        // set the allowance
        const response = await Relayer.execTransaction(safeAddress, ethereumAddress, commonTx.to, commonTx.value, commonTx.data, commonTx.signature)
        if (response.status !== 200) {
          // TODO: please do not return the tx.hash here, which is the has from the minting transaction which ahppend earlier
          res.status(500).send({ error: 'Approve address failed', errorCode: 102, mint: tx.hash })
          if (preAuthId) {
            cancelPreauthorizedPayment(preAuthId);
          }
          return
        }
        // Wait for the allowance to be confirmed
        await provider.waitForTransaction(response.data.txHash)
      }
    } else {
      console.log('No PreAuthId. NO PAYMENT SERVICES.');  
    }
    
    await Relayer.addAddressToWhitelist([commonTx.to, pluginTx.to]);
     
    const response2 = await Relayer.execTransaction(safeAddress, ethereumAddress, pluginTx.to, pluginTx.value, pluginTx.data, pluginTx.signature)
    if (response2.status !== 200) {
      response2.status(500).send({ error: 'Request to join failed', errorCode: 104, data: response2.data })
      cancelPreauthorizedPayment(preAuthId);
      return
    }
    
    const receipt2 = await provider.waitForTransaction(response2.data.txHash);
    // TODO: we should get the ABI from arc.js using arc.getABI("JoinAndQuit", ARC_VERSION)
    const interf = new ethers.utils.Interface(abi.JoinAndQuit)
    const events = getTransactionEvents(interf, receipt2)
    
    // TODO:  if the transacdtion reverts, we can check for that here and include that in the error message
    if (!events.JoinInProposal) {
      res.status(500).send({ 
        txHash: response2.data.txHash, 
        error: 'Transaction was mined, but no JoinInProposal event was found in the receipt'
      })
      return
    }
    
    const proposalId = events.JoinInProposal._proposalId
    console.debug(`Created proposal ${proposalId}`)
    
    // TODO: the payment will be made only after the proposal is accepted. There is an issue in jira on this..
    // if (paymentData.funding > 0) {
    //   const { Status: payInStatus } = await payToDAOStackWallet({ _preAuthId, _amount, userData });
    //   console.log('PayIn Status:', payInStatus);
    // }
    
    if (proposalId && proposalId.length) {
      await updateProposalById(proposalId, {retries: 4});
      res.send({ txHash: response2.data.txHash, proposalId: proposalId });
      return;
    } else {
      res.status(500).send({ 
        txHash: response2.data.txHash, 
        error: 'Transation was mined, but no proposalId was found in the JoinInProposal event' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({error: `${err}`});
  }
})

relayer.post('/createCommonStep2', async (req, res) => {
  try {
    const { idToken, commonTx, commonId } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    const userData = await admin.firestore().collection('users').doc(uid).get().then(doc => { return doc.data() })
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress
    
    const response = await Relayer.execTransaction(safeAddress, ethereumAddress, commonTx.to, commonTx.value, commonTx.data, commonTx.signature)
    if (response.status !== 200) {
      res.status(500).send(JSON.stringify(response.data))
      return
    }
    
    const receipt = await provider.waitForTransaction(response.data.txHash)
    const isSuccess = isRelayerTxSuccessWithReceipt(receipt)
    
    if (!isSuccess) {
      return res.send({msg: 'Failed in Safe Exectution', code: 201, txHash: response.data.txHash})
    }
    
    // TODO: wait a second before calling this function, so we have a higher probalby to find the result at the first try
    await updateDaoById(commonId, {retries: 4});

    res.send({message: `Created common with id ${commonId}`, daoId: commonId, txHash: response.data.txHash})
  } catch (err) {
    res.status(500).send({error: `${err}`});
  }
})

exports.relayer = functions.runWith(runtimeOptions).https.onRequest(relayer);
