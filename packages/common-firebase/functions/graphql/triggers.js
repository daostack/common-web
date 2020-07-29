const functions = require('firebase-functions');
const { updateDaoById } = require('./ArcListener');
const { sendMail } = require('../mailer');
const { env } = require('../env');
const util = require('../util/util');

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
    const userId = newDao.members[0].userId;
    const userData = await util.getUserById(userId);
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
