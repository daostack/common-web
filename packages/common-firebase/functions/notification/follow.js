/* eslint-disable no-unused-vars */
const functions = require('firebase-functions');
const Notification = require('./notification');
const admin = require('firebase-admin');

// Follow User
function follow(userId, userList) {
  console.log('Follow User', userId, userList);
  for (var targetUid of userList) {
    console.log('New follow', userId, targetUid);
    const writeNotifications = admin.firestore().doc(`notification/follow/${userId}/${targetUid}`).set({ createdAt: new Date() }, { merge: false });
    const writeFollow = admin.firestore().doc(`users/${targetUid}`).update({ follower: admin.firestore.FieldValue.arrayUnion(userId) })
    // tasks.append(writeNotifications)
    // tasks.append(writeFollow)

    // @question Ask about this. Maybe make the whole function async?
    // eslint-disable-next-line
    Promise.all([writeNotifications, writeFollow]);
  }
}

function unfollow(userId, userList) {
  // let tasks = [];
  for (const targetUid of userList) {
    const writeUnFollow = admin.firestore().doc(`users/${targetUid}`).update({ follower: admin.firestore.FieldValue.arrayRemove(userId) })

    // @question Ask about this. Maybe make the whole function async?
    // eslint-disable-next-line
    Promise.all([writeUnFollow]);
  }
}

const userInfoTrigger = functions.firestore.document('/users/{userId}')
  .onUpdate(async (change, context) => {
    // eslint-disable-next-line
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

const sendFollowerNotification = functions.firestore.document('/notification/follow/{userId}/{targetUid}')
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

// Disable following logic
// module.exports = { userInfoTrigger, sendFollowerNotification };
