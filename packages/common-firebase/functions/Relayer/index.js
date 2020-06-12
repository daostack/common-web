const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const abi = require('./abi.json');
const Relayer = require('./relayer');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ethers = require('ethers');
const env = require('../_keys/env');

const { updateProposals, updateDaos } = require('../graphql/ArcListener');
const provider = new ethers.providers.JsonRpcProvider('https://dai.poa.network/');

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
    const idToken = req.header('idToken');
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    const userRef = admin.firestore().collection('users').doc(uid)
    const userData = await userRef.get().then(doc => { return doc.data() })
    const address = userData.ethereumAddress
    const response = await Relayer.createWallet(address)
    const txHash = response.data.txHash
    const safeAddress = await Relayer.getAddressFromEvent(txHash)
    await userRef.update({ safeAddress: safeAddress.toLowerCase() })
    await Relayer.addAddressToWhitelist([address]);
    const whitelist = await Relayer.addProxyToWhitelist([safeAddress]);
    res.send({ txHash, safeAddress, whitelist: whitelist.data.message })
  } catch (err) {
    res.send(err);
  }
})

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
    res.send(err);
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
    res.send(err);
  }
})

relayer.post('/execTransaction', async (req, res) => {
  try {
    // const idToken = req.header('idToken');
    const { to, value, data, signature, idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    const userData = await admin.firestore().collection('users').doc(uid).get().then(doc => { return doc.data() })
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress
    await Relayer.addAddressToWhitelist([to]);
    const response = await Relayer.execTransaction(safeAddress, ethereumAddress, to, value, data, signature)
    // TODO: Once it failed, it will send detail to client which have apiKey
    res.send(response.data);
  } catch (err) {
    res.send(err);
  }
})

relayer.post('/requestToJoin', async (req, res) => {
  try {
    const {
      idToken,
      commonTx,
      pluginTx,
    } = req.body;
    // const {to, value, data, signature, idToken, plugin} = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    const userData = await admin.firestore().collection('users').doc(uid).get().then(doc => { return doc.data() })
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress

    // TODO: replace with estimate gas
    const OVERRIDES = {
      gasLimit: 10000000,
      gasPrice: 15000000000,
    };

    let minter = new ethers.Wallet(env.commonInfo.pk, provider);
    let contract = new ethers.Contract(env.commonInfo.commonToken, abi.CommonToken, minter);
    let tx = await contract.mint(safeAddress, ethers.utils.parseEther('0.1'), OVERRIDES);
    let receipt = await tx.wait();

    if (!receipt) {
      res.send({ error: 'Claim Token failed', errorCode: 101 })
    }

    await Relayer.addAddressToWhitelist([commonTx.to, pluginTx.to]);

    let allowance = await contract.allowance(safeAddress, pluginTx.to);
    const allowanceStr = ethers.utils.formatEther(allowance);

    // If allowance is 0.0, we need approve the allowance
    if (allowance.isZero()) {
      const response = await Relayer.execTransaction(safeAddress, ethereumAddress, commonTx.to, commonTx.value, commonTx.data, commonTx.signature)
      if (response.status !== 200) {
        res.status(500).send({ error: 'Approve address failed', errorCode: 102, mint: tx.hash })
        return
      }

      const response2 = await Relayer.execTransaction(safeAddress, ethereumAddress, pluginTx.to, pluginTx.value, pluginTx.data, pluginTx.signature)
      if (response2.status !== 200) {
        res.status(500).send({ error: 'Request to join failed', errorCode: 104, mint: tx.hash, allowance: allowanceStr })
        return
      }

      const receipt = await provider.waitForTransaction(response2.data.txHash);
      const interf = new ethers.utils.Interface(abi.JoinAndQuit)
      const events = getTransactionEvents(interf, receipt)

      if (!events.JoinInProposal) {
        res.send({ mint: tx.hash, allowance: allowanceStr, joinHash: response2.data.txHash, msg: 'Join in failed' })
        return
      }

      const proposalId = events.JoinInProposal._proposalId

      if (proposalId && proposalId.length) {
        await updateProposals();
        res.send({ mint: tx.hash, allowance: allowanceStr, joinHash: response2.data.txHash, proposalId: proposalId });
        return;
      }

      res.send({ mint: tx.hash, allowance: allowanceStr, joinHash: response2.data.txHash, msg: 'Join in failed' });

    } else {

      const response2 = await Relayer.execTransaction(safeAddress, ethereumAddress, pluginTx.to, pluginTx.value, pluginTx.data, pluginTx.signature)
      if (response2.status !== 200) {
        res.status(500).send({ error: 'Request to join failed', errorCode: 105, mint: tx.hash, allowance: allowanceStr })
        return
      }

      const receipt = await provider.waitForTransaction(response2.data.txHash);
      const interf = new ethers.utils.Interface(abi.JoinAndQuit)
      const events = getTransactionEvents(interf, receipt)

      if (!events.JoinInProposal) {
        res.send({ mint: tx.hash, allowance: allowanceStr, joinHash: response2.data.txHash, msg: 'Join in failed' })
        return
      }

      const proposalId = events.JoinInProposal._proposalId

      if (proposalId && proposalId.length) {
        await updateProposals();
        res.send({ mint: tx.hash, allowance: allowanceStr, joinHash: response2.data.txHash, proposalId: proposalId });
        return;
      }

      res.send({ mint: tx.hash, allowance: allowanceStr, joinHash: response2.data.txHash, msg: 'Join in failed' });
    }

    res.send({ error: 'Should not be here', errorCode: 106 })
  } catch (err) {
    res.send(err);
  }
})

relayer.post('/createCommonStep2', async (req, res) => {
  try {
    const { idToken, commonTx } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const uid = decodedToken.uid;
    const userData = await admin.firestore().collection('users').doc(uid).get().then(doc => { return doc.data() })
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress

    const response = await Relayer.execTransaction(safeAddress, ethereumAddress, commonTx.to, commonTx.value, commonTx.data, commonTx.signature)
    if (response.status !== 200) {
      res.statusCode(500).send(JSON.stringify(response.data))
      return
    }

    const receipt = await provider.waitForTransaction(response.data.txHash)
    const isSuccess = isRelayerTxSuccessWithReceipt(receipt)

    if (!isSuccess) {
      return res.send({msg: 'Failed in Safe Exectution', code: 201, txHash: response.data.txHash})
    }
    
    await updateDaos();
    res.send({txHash: response.data.txHash})
  } catch (err) {
    res.send(err);
  }
})

function getTransactionEvents(interf, receipt) {
  const txEvents = {};
  const abiEvents = Object.values(interf.events);
  for (const log of receipt.logs) {
    for (const abiEvent of abiEvents) {
      if (abiEvent.topic === log.topics[0]) {
        txEvents[abiEvent.name] = abiEvent.decode(log.data, log.topics);
        break;
      }
    }
  }
  return txEvents;
}

// async function isRelayerTxSuccess(txHash) {
//   const receipt = await this.provider.waitForTransaction(txHash);
//   return this.isRelayerTxSuccessWithReceipt(receipt);
// }

function isRelayerTxSuccessWithReceipt(receipt) {
  const ExecutionFailureTopic = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23';
  for (const log of receipt.logs) {
    if (log.topics[0] === ExecutionFailureTopic) {
      return false;
    }
  }
  return true;
}

exports.relayer = functions.runWith(runtimeOptions).https.onRequest(relayer);
