const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { updateDaoById } = require('./ArcListener');
const { sendMail } = require('../mailer');
const { env } = require('../env');

exports.watchForReputationRedeemed = functions.firestore
    .document('/proposals/{id}')
    .onUpdate(async (change) => {
        const data = change.after.data();
        const previousData = change.before.data();
        if (
          data.type === 'JoinAndQuit' &&
          previousData.joinAndQuit.reputationMinted === '0' &&
          data.joinAndQuit.reputationMinted !== '0'
        ) {
          console.log(
            'JoinAndQuit proposal reputationMinted changed from "0" Initiating DAO update'
          );
          try {
            await updateDaoById(data.dao);
          } catch (e) {
            console.log(e);
          }
        } 
    });

exports.newDaoCreated = functions.firestore
  .document('/daos/{id}')
  .onCreate(async (snap) => {
    const newDao = snap.data();
    const userData = await admin
      .firestore()
      .collection('users')
      .doc(newDao.members[0].userId)
      .get()
      .then((doc) => {
        return doc.data();
      });
    const daoName = newDao.name;
    sendMail(
      userData.email,
      `Your DAO is ready`,
      `Your DAO ${daoName} has been created.`
    );
    sendMail(
      env.mail.adminMail,
      `New DAO has been created`,
      `New DAO ${daoName} from user ${userData.displayName} has been created.`
    );
  });
