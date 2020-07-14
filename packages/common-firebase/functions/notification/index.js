const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Notification = require('./Notification');

// Follow User
function follow(userId, userList) {
  console.log('Follow User', userId, userList);
  for (var targetUid of userList) {
    console.log('New follow', userId, targetUid);
    const writeNotifications = admin.firestore().doc(`notification/follow/${userId}/${targetUid}`).set({ createdAt: new Date() }, { merge: false });
    const writeFollow = admin.firestore().doc(`users/${targetUid}`).update({ follower: admin.firestore.FieldValue.arrayUnion(userId) })
    // tasks.append(writeNotifications)
    // tasks.append(writeFollow)
    Promise.all([writeNotifications, writeFollow]);
  }
}

function unfollow(userId, userList) {
  // let tasks = [];
  for (const targetUid of userList) {
    const writeUnFollow = admin.firestore().doc(`users/${targetUid}`).update({ follower: admin.firestore.FieldValue.arrayRemove(userId) })
    Promise.all([writeUnFollow]);
  }
}

exports.userInfoTrigger = functions.firestore.document('/users/{userId}')
  .onUpdate(async (change, context) => {

    Array.prototype.diff = function (a) {
      return this.filter(function (i) { return a.indexOf(i) < 0; });
    };

    const userId = context.params.userId;
    const txBList = change.before.get('transactionHistory')
    const txAList = change.after.get('transactionHistory')
    if (JSON.stringify(txBList) !== JSON.stringify(txAList)) {
      const txHash = txAList.pop();
      console.log('New transaction', userId, txHash);
      return admin.firestore().doc(`notification/transaction/${userId}/${txHash}`).set({ createdAt: new Date() })
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


exports.commonCreation = functions.firestore.document('/daos/{daoId}')
.onCreate(async (snapshot, context) => {
  const daoId = context.params.daoId;
 const daoData = snapshot.data();
 const ownerId = daoData.members[0].userId;
  return admin.firestore().doc(`notification/commonCreation/${ownerId}/${daoId}`).set({ createdAt: new Date() })
})

exports.commonCreationNotification = functions.firestore.document('/notification/commonCreation/{userId}/{commonId}')
.onCreate(async (snapshot, context) => {
  const userId = context.params.userId;
  const commonId = context.params.commonId;

  const tokenRef = admin.firestore().collection('users').doc(`${userId}`)
  const tokens = await tokenRef.get().then(doc => { return doc.data().tokens })

  const commonRef = await admin.firestore().collection('daos').doc(`${commonId}`)
  const common = await commonRef.get().then(doc => { return doc.data() })

  let title = 'Your common was created 🎉';
  let body = `${common.name} is available on common list.`
  let image = common.metadata.avatar || '';

  return Notification.send(tokens, title, body, image);
})

// exports.listenToTransaction = functions.firestore.document('/notification/transaction/{uid}/{txHash}')
// .onCreate(async (change, context) => {
//   const uid = context.params.uid;
//   const txHash = context.params.txHash;

//   const tokenRef = admin.firestore().collection('users').doc(uid)
//   const tokens = await tokenRef.get().then(doc => { return doc.data().tokens })

//   console.log("Token: ", tokens);
//   const receipt = await provider.waitForTransaction(txHash);

//   let title;
//   let body;

//   if (receipt.status === 0) {
//     title = "❌ Your transaction have failed"
//     body = txHash
//   } else {
//     title = "✅ Your transaction have been confirmed"
//     body = txHash
//   }

//   return Notification.send(tokens, title, body);
// })
