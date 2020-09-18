const functions = require('firebase-functions');
const { updateDaoById } = require('../Dao');
const { createLegalUser, createWallet } = require('../../mangopay/mangopay');
const { Utils, PROPOSAL_TYPE } = require('../../util/util');
const { env } = require('@env');

const emailClient = require('../../email');

exports.newProposalCreated = functions
  .firestore
  .document('/proposals/{id}')
  .onCreate(async (snap) => {
    const proposal = snap.data();

    if(proposal.name === PROPOSAL_TYPE.Join) {
      const proposer = await Utils.getUserById(proposal.proposerId);
      const common = await Utils.getCommonById(proposal.dao);

      if(!common) {
        throw new Error(`
          New proposal was created from user (${proposal.proposerId}) 
          in common (${proposal.dao}), but the common was not found. 
          Created proposal id is ${proposal.id}
        `);
      }

      await emailClient.sendTemplatedEmail({
        to: proposer.email,
        templateKey: 'requestToJoinSubmitted',
        emailStubs: {
          name: proposer.displayName,
          link: Utils.getCommonLink(common.id),
          commonName: common.metadata.name
        }
      })
    }
  })

exports.watchForReputationRedeemed = functions.firestore
  .document('/proposals/{id}')
  .onUpdate(async (change) => {
    const data = change.after.data();
    const previousData = change.before.data();
    if (
      data.type === PROPOSAL_TYPE.Join &&
      previousData.join.reputationMinted === '0' &&
      data.join.reputationMinted !== '0'
    ) {
      console.log(
        'Join proposal reputationMinted changed from "0" Initiating DAO update'
      );
      try {
        await updateDaoById(data.dao);
      } catch (e) {
        console.error(e);
      }
    }
  });

exports.daoUpdated = functions.firestore
  .document('/daos/{id}')
  .onUpdate(async (snap) => {
    const dao = snap.after.data();
    const oldDao = snap.before.data();

    if (dao.register === 'registered' && (dao.register !== oldDao.register)) {
      const creator = await Utils.getUserById(dao.members[0].userId);

      await emailClient.sendTemplatedEmail({
        to: creator.email,
        templateKey: 'userCommonFeatured',
        emailStubs: {
          name: creator.displayName,
          commonName: dao.name,
          commonLink: Utils.getCommonLink(dao.id)
        }
      })
    }
  });

exports.newDaoCreated = functions.firestore
  .document('/daos/{id}')
  .onCreate(async (snap) => {
    let newDao = snap.data();

    const userId = newDao.members[0].userId;
    const userData = await Utils.getUserById(userId);
    const daoName = newDao.name;

    try {
      const { Id: mangopayId } = await createLegalUser(newDao);
      const { Id: mangopayWalletId } = await createWallet(mangopayId);

      if (mangopayId && mangopayWalletId) {
        const commonLink = Utils.getCommonLink(newDao.id);

        console.debug(`Sending admin email for CommonCreated to ${env.mail.adminMail}`);
        console.debug(`Sending user email for CommonCreated to ${userData.email}`);

        await Promise.all([
          emailClient.sendTemplatedEmail({
            to: userData.email,
            templateKey: 'userCommonCreated',
            emailStubs: {
              commonLink,
              name: userData.displayName,
              commonName: daoName
            }
          }),

          emailClient.sendTemplatedEmail({
            to: env.mail.adminMail,
            templateKey: 'adminCommonCreated',
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

        console.debug('Done sending emails for dao creation');

        return snap.ref.set({ mangopayId, mangopayWalletId }, { merge: true });
      }
    } catch (e) {
      console.error(e);

      console.debug(`Sending admin email for WalletCreationFailed to ${env.mail.adminMail}`);
      await emailClient.sendTemplatedEmail({
        to: env.mail.adminMail,
        templateKey: 'adminWalletCreationFailed',
        emailStubs: {
          commonName: daoName,
          commonId: newDao.id
        }
      });
    }
  });
