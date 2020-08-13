const functions = require('firebase-functions');
const {updateDaoById} = require('./ArcListener');
const {env} = require('../env');
const {createLegalUser, createWallet} = require('../mangopay/mangopay');
const util = require('../util/util');

const emailClient = require('../email');

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
        console.error(e);
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

    try {
      const {Id: mangopayId} = await createLegalUser(newDao);
      const {Id: mangopayWalletId} = await createWallet(mangopayId);

      if (mangopayId && mangopayWalletId) {
        return snap.ref.set({mangopayId, mangopayWalletId}, {merge: true});
      }
    } catch (e) {
      console.error(e);

      await emailClient.sendTemplatedEmail({
        to: env.mail.adminMail,
        templateKey: 'adminWalletCreationFailed',
        emailStubs: {
          commonName: daoName,
          commonId: newDao.id
        }
      });

      return;
    }

    const commonLink = `https://app.common.io/common/${newDao.id}`;

    await Promise.all([
      emailClient.sendTemplatedEmail({
        to: userData.email,
        templateKey: "userCommonCreated",
        emailStubs: {
          commonLink,
          name: userData.displayName,
          commonName: daoName,
        }
      }),

      emailClient.sendTemplatedEmail({
        to: env.mail.adminMail,
        templateKey: "adminCommonCreated",
        emailStubs: {
          userId,
          commonLink,
          userName: userData.displayName,
          userEmail: userData.email,
          commonCreatedOn: new Date().toDateString(),
          log: 'Successfully created common',
          commonId: newDao.id,
          commonName: newDao.name,
          description: newDao.metadata.description,
          about: newDao.metadata.byline,
          paymentType: 'one-time',
          minContribution: newDao.minFeeToJoin
        }
      })
    ]);
  });
