const functions = require('firebase-functions');
const Notification = require('./notification');
const admin = require('firebase-admin');

const commonCreation = functions.firestore.document('/daos/{daoId}')
.onCreate(async (snapshot, context) => {
  const daoId = context.params.daoId;
 const daoData = snapshot.data();
 const ownerId = daoData.members[0].userId;
  return admin.firestore().doc(`notification/commonCreation/${ownerId}/${daoId}`).set({ createdAt: new Date() })
})

const commonCreationNotification = functions.firestore.document('/notification/commonCreation/{userId}/{commonId}')
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

module.exports = { commonCreation, commonCreationNotification };
