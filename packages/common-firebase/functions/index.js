const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./_keys/adminsdk-keys.json')),
  databaseURL: "https://common-daostack.firebaseio.com",
});

const ethers = require('ethers');
const Notification = require('./Notification');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {updateDaos, updateProposals, test} = require('./ArcListener')

const env = require('./_keys/env');
const privateKey = env.wallet_info.private_key;
const provider = new ethers.providers.JsonRpcProvider('https://xdai.poanetwork.dev/');

let wallet = new ethers.Wallet(privateKey, provider);
let amount = ethers.utils.parseEther('0.1');

// create an Arc instance
const app = express();

// Automatically allow cross-origin requests
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors({ origin: true }));


// const messaging = admin.messaging();

app.get('/', async (req, res) => {
  const message = "G'day mate";
  res.send({message})
});


app.get('/test', async (req, res) => {
  const message = await test()
  res.send(message)
})
app.get('/update-daos', async (req, res) => {
  try {
    const result = await updateDaos();
    console.log(result)
    const code = 200;
    res.status(code).send(`Updated DAOs successfully: ${result}`);
  } catch(e) {
    const code = 500;
    console.log(e)
    res.status(code).send(new Error(`Unable to update DAOs: ${e}`));
  }

});

app.get('/update-proposals', async (req, res) => {
  try {
    const result = await updateProposals();
    console.log(result)
    const code = 200;
    res.status(code).send(`Updated Propsals successfully: ${result}`);
  } catch(e) {
    const code = 500;
    console.log(e)
    res.status(code).send(new Error(`Unable to update Proposals: ${e}`));
  }

});

app.get('/send-test-eth/:address', async (req, res) => {
  try {
    const address = req.param("address");
    console.log('address: ', address);
    if (address) {
      let balance = ethers.utils.formatEther(await provider.getBalance(address));
      // console.log(address + ': ' + balance);
      if (balance > 0.5) {
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
      res.status(code).send(`Successful transaction: ${transaction.hash}`);

    }

  } catch(e) {
    const code = 500;
    res.status(code).send(new Error('Unable to send transaction'));
  }
});

app.get('/notification', async (req, res) => {
  try {
    // const message = await messaging.send(payload);
    res.send({message: 'hello'});

  } catch(e) {
    console.log('notification error: ', e);
  }
});

// Expose Express API as a single Cloud Function:
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

// Follow User
function follow(userId, userList) {
  console.log('Follow User', userId, userList);
  for (var targetUid of userList) {
    console.log('New follow', userId, targetUid);
    const writeNotifications = admin.firestore().doc(`notification/follow/${userId}/${targetUid}`).set({createdAt: new Date()}, {merge: false});
    const writeFollow = admin.firestore().doc(`users/${targetUid}`).update({follower: admin.firestore.FieldValue.arrayUnion(userId)})
    // tasks.append(writeNotifications)
    // tasks.append(writeFollow)
    Promise.all([writeNotifications, writeFollow]);
  }
}

function unfollow(userId, userList) {
  // let tasks = [];
  for (const targetUid of userList) {
    const writeUnFollow = admin.firestore().doc(`users/${targetUid}`).update({follower: admin.firestore.FieldValue.arrayRemove(userId)})
    Promise.all([writeUnFollow]);
  }
}

exports.userInfoTrigger = functions.firestore.document('/users/{userId}')
  .onUpdate(async (change, context) => {

    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    const userId = context.params.userId;
    const txBList = change.before.get('transactionHistory')
    const txAList = change.after.get('transactionHistory')
    if (JSON.stringify(txBList) !== JSON.stringify(txAList)) {
      const txHash = txAList.pop();
      console.log('New transaction', userId, txHash);
      return admin.firestore().doc(`notification/transaction/${userId}/${txHash}`).set({createdAt: new Date()})
    }

    const followB = change.before.get('following')
    const followA = change.after.get('following')
    const diffFollow = followB.diff(followA).concat(followA.diff(followB));
    console.log('diffFollow', diffFollow);
    if (diffFollow.length > 0) {
      if (followB.length > followA.length) {
        console.log('UNFOLLOW')
        unfollow(userId, diffFollow);
      } else {
        console.log('FOLLOW')
        follow(userId, diffFollow);
      }
    }
    return Promise.resolve(null);
  })

exports.sendFollowerNotification = functions.firestore.document('/notification/follow/{userId}/{targetUid}')
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    const targetUid = context.params.targetUid;
    // response.send(`Change: ${change.after.val()} - ID: ${commonId}`)

    console.log(`uid: ${targetUid} - ID: ${userId}`);
    const tokenRef = admin.firestore().collection('users').doc(`${targetUid}`)
    const tokens = await tokenRef.get().then(doc => { return doc.data().tokens })
    const follower = await admin.auth().getUser(userId);

    console.log(`tokens: ${tokens}  - follower: ${follower.displayName}`);

    let title = 'You have a new follower';
    let body = `${follower.displayName} is now following you.`
    let image = follower.photoURL

    return Notification.send(tokens, title, body, image);
  })

//
// '* * * * *'
// minute hour dayofmonth month dayofweek

// "every five minutes"
// '*/5 * * * *
// exports.scheduledFunction = functions.pubsub.schedule('*/5 * * * *').onRun((context) => {
//   updateDaos();
//   return null;
// });
