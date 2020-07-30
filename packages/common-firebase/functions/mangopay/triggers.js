const functions = require('firebase-functions');
const {
  payToDAOStackWallet,
  cancelPreauthorizedPayment,
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
      const userData = await util.getUserById(data.proposerId)
      try {
        const preAuthId = data.description.preAuthId;
        const amount = parseInt(data.description.funding, 16);
        const { Status } = await payToDAOStackWallet({
          preAuthId,
          Amount: amount,
          userData,
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
