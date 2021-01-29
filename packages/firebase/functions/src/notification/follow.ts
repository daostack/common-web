//import { INotificationModel } from "./";

// declare global {
//   interface Array<T> {
//     diff(array: Array<T>);
//   }
// }

/* eslint-disable no-unused-vars */
/*
import functions from 'firebase-functions';
//import Notification from './notification';
import admin from 'firebase-admin';

// Follow User
function follow(userId, userList) {
  console.log('Follow User', userId, userList);
  for (const targetUid of userList) {
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

const unfollow = (userId, userList) => {
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
      return this.filter((i) => { return a.indexOf(i) < 0; });
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
*/

// const sendFollowerNotification = async (notification: INotificationModel, tokens: [string]) => {

//   const follower = await admin.auth().getUser(notification.userId);

//   console.log(`tokens: ${tokens}  - follower: ${follower.displayName}`);

//   const title = 'You have a new follower';
//   const body = `${follower.displayName} is now following you.`
//   const image = follower.photoURL

//   return Notification.send(tokens, title, body, image);
// }

// Disable following logic
// module.exports = { userInfoTrigger, sendFollowerNotification };
