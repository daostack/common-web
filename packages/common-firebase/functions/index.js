const functions = require('firebase-functions');
const ethers = require('ethers');
const Notification = require('notification')

const admin = require('firebase-admin');
admin.initializeApp();

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
