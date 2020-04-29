const functions = require('firebase-functions');
const ethers = require('ethers');
// const Notification = require('./Notification')

const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

admin.initializeApp({
  credential: admin.credential.cert(require('./_keys/adminsdk-keys.json')),
  databaseURL: "https://common-daostack.firebaseio.com",
});
const graphHttpLink =
  'https://api.thegraph.com/subgraphs/name/daostack/v7_2_exp_rinkeby';
const graphwsLink =
  'wss://api.thegraph.com/subgraphs/name/daostack/v7_2_exp_rinkeby';

const env = require('./_keys/env');
const privateKey = env.wallet_info.private_key;
const provider = ethers.getDefaultProvider('rinkeby');
let wallet = new ethers.Wallet(privateKey, provider);
let amount = ethers.utils.parseEther('0.1');

const Arc = require('@daostack/client').Arc;
// const Arc = require('../dist/lib/index.js').Arc

// create an Arc instance
const arc = new Arc({
  graphqlHttpProvider: graphHttpLink,
  graphqlWsProvider: graphwsLink,
  web3Provider: `wss://rinkeby.infura.io/ws/v3/${'4406c3acf862426c83991f1752c46dd8'}`,
  ipfsProvider: {
    "host": "subgraph.daostack.io",
    "port": "443",
    "protocol": "https",
    "api-path": "/ipfs/api/v0/"
  }
});

async function main() {
  try {
    const db = admin.firestore();
    //
    // const kany = await fetch('https://api.kanye.rest/');
    // console.log("YE SAYS: ", await kany.json());

    // get a list of DAOs
    arc
      .daos({orderBy: 'name', orderDirection: 'asc'}, {fetchAllData: true})
      .subscribe(res => {
        res.map(dao => {
          const {name, id, memberCount, tokenName} = dao.coreState;
          db.collection('daos').doc(id).set({name, id, memberCount, tokenName}).then(() => {
            console.log('added dao');
          }, (error) => {
            console.error('Failed to add dao');
            console.error(error);
          });
          console.log(name + ': ', {name, id, memberCount, tokenName})
        })
        // console.log(res);
      });

  } catch(e) {
    console.log('ERROR: ', e)
  }

}

main();


const app = express();

// Automatically allow cross-origin requests
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

const messaging = admin.messaging();

app.get('/', async (req, res) => {
  const message = "G'day mate";
  res.send({message})
});

app.get('/send-test-eth/:address', async (req, res) => {
  try {
    const address = req.param("address");
    console.log('address: ', address)
    if (address) {
      let balance = ethers.utils.formatEther(await provider.getBalance(address));
      // console.log(address + ': ' + balance);
      if (balance > 0.1) {
        const code = 200;
        res.status(code).send('Balance exceeds 0.1 ETH');
        return
      }

      let tx = {
        to: address,
        value: amount
      };

      let transaction = await wallet.sendTransaction(tx);
      console.log(transaction);
      const code = 200;
      res.status(code).send(new Error(`Successful transaction: ${transaction.hash}`));

    }

  } catch(e) {
    const code = 500;
    res.status(code).send(new Error('Unable to send transaction'));
  }
});

app.post('/notification', async (req, res) => {
  try {
    console.log('REQUEST DATA: ', req.body);
    const {registrationToken, title, body, data} = req.body;
    const payload = {
      token: registrationToken,
      notification: {
        title,
        body
      },
      data
    };

    const message = await messaging.send(payload);
    res.send({message});

  } catch(e) {
    console.log('notification error: ', e);
  }
});

// Expose Express API as a single Cloud Function:
// exports.widgets = functions.https.onRequest(app);

exports.api = functions.https.onRequest(app);


exports.listenToTransaction = functions.firestore.document('/notification/transaction/{uid}/{txHash}').onCreate(async (change, context) => {
  const uid = context.params.uid;
  const txHash = context.params.txHash;

  const tokenRef = admin.firestore().collection('users').doc(`${uid}`)
  const tokens = await tokenRef.get().then(doc => { return doc.data().tokens })

  console.log("Token: ", tokens);

  const provider = new ethers.providers.InfuraProvider(
    'rinkeby',
    '3c08878d00734c0c98a3e4741d0b4cfc',
  );

  const receipt = await provider.waitForTransaction(txHash);

  let title;
  let body;

  if (receipt.status === 0) {
    title = "❌ Your transaction have failed"
    body = txHash
  } else {
    title = "✅ Your transaction have been confirmed"
    body = txHash
  }

  return Notification.send(tokens, title, body);
});

exports.userInfoTrigger = functions.firestore.document('/users/{userId}')
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const txBList = change.before.get('transactionHistory')
    const txAList = change.after.get('transactionHistory')
    if (JSON.stringify(txBList) !== JSON.stringify(txAList)) {
      const txHash = txAList.pop();
      console.log('New transaction', userId, txHash);
      return admin.firestore().doc(`notification/transaction/${userId}/${txHash}`).set({createdAt: new Date()})
    }

    const followedBList = change.before.get('following')
    const followedAList = change.after.get('following')
    if (JSON.stringify(followedBList) !== JSON.stringify(followedAList)) {
      const targetUid = followedAList.pop();
      console.log('New follow', userId, targetUid);
      const writeNotifications = admin.firestore().doc(`notification/follow/${userId}/${targetUid}`).set({createdAt: new Date()})
      const writeFollow = admin.firestore().doc(`users/${targetUid}`).update({follower: admin.firestore.FieldValue.arrayUnion(userId)})
      return Promise.all([writeNotifications, writeFollow])
    }
    return Promise.resolve(null);

})

exports.sendFollowerNotification = functions.firestore.document('/notification/follow/{userId}/{targetUid}')
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const targetUid = context.params.targetUid;
    // response.send(`Change: ${change.after.val()} - ID: ${commonId}`)

    console.log(`uid: ${targetUid} - ID: ${userId}`);
    const tokenRef = admin.firestore().collection('users').doc(`${targetUid}`)
    const tokens = await tokenRef.get().then(doc => { return doc.data().tokens })
    const follower = await admin.auth().getUser(userId);

    console.log(`tokens: ${tokens}  - follower: ${follower.displayName}`);

    let title = 'You have a new follower!';
    let body = `${follower.displayName} is now following you.`

    return Notification.send(title, body,)
  })
