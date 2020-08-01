const functions = require('firebase-functions');
const {
  payToDAOWallet,
  cancelPreauthorizedPayment,
  createLegalUser,
  createWallet
} = require('../mangopay/mangopay');
const { sendMail } = require('../mailer');
const { env } = require('../env');
const { updateDAOBalance } = require("../graphql/updateDAOBalance");
const { minterToken } = require('../relayer/minterToken')
const util = require('../util/util');


exports.watchForExecutedProposals = functions.firestore
  .document('/proposals/{id}')
  .onUpdate(async (change) => {
    const data = change.after.data();
    const previousData = change.before.data();
    if (
      data.executed !== previousData.executed &&
      data.executed === true &&
      data.winningOutcome === 1 && data.description.preAuthId
    ) {
      console.log(
        'Proposal EXECUTED and WINNING OUTCOME IS 1 -> INITIATING PAYMENT'
      );
      const userData = await util.getUserById(data.proposerId);
      let daoData = await util.getCommonById(data.dao);
      try {
        // this block here up to line 46 can be extracted to a method, same is used in graphql's trigger newDaoCreated
        if (!daoData.mangopayId) {
          const { Id: mangopayId } = await createLegalUser(daoData);
          const { Id: mangopayWalletId } = await createWallet(mangopayId);
          if (mangopayId && mangopayWalletId) {
            const daoRef = await util.getDaoRef(daoData.id);
            await daoRef.update({ mangopayId, mangopayWalletId });
            daoData = await util.getCommonById(data.dao); // update daoData
          } else {
            sendMail(
              env.mail.adminMail,
              `Failed to create mangopayId or walletId for DAO: ${daoData.name} with id: ${daoData.id}`,
              `Failed to create mangopayId or walletId`
            );
          }
        }
        const preAuthId = data.description.preAuthId;
        const amount = data.description.funding;
        const { Status } = await payToDAOWallet({
          preAuthId,
          Amount: amount,
          userData,
          daoData
        });
        if (Status === 'SUCCEEDED') {
          sendMail(
            env.mail.adminMail,
            'Successfull pay-In',
            `Pay-In successfull for Proposal with ID ${data.id}`
          );
          sendMail(
            userData.email,
            'Successfull payment',
            `Your request to join has been approved and the amount of ${data.joinAndQuit.funding}$ was charged.`
          );
          await minterToken(data.dao, amount)
          await updateDAOBalance(data.dao);
          return change.after.ref.set(
            {
              paymentStatus: 'paid',
            },
            { merge: true }
          );
        } else throw new Error('Payment failed');
      } catch (e) {
        console.error('ERROR EXECUTING PRE AUTH PAYMENT', e);
        sendMail(
          env.mail.adminMail,
          'Failed pay-In',
          `Pay-In failed for Proposal with ID ${data.id}`
        );
        return change.after.ref.set(
          {
            paymentStatus: 'failed',
          },
          { merge: true }
        );
      }
    } else if (
      data.executed !== previousData.executed &&
      data.executed === true &&
      data.winningOutcome === 0
    ) {
      await cancelPreauthorizedPayment(data.description.preAuthId);
    }
  });
