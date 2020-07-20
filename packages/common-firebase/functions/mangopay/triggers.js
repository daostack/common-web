const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {
  payToDAOStackWallet,
  cancelPreauthorizedPayment,
} = require('../mangopay/mangopay');
const { sendMail } = require('../mailer');
const { env } = require('../env');
const { updateDAOBalance } = require("../graphql/updateDAOBalance");

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
      const userData = await admin
        .firestore()
        .collection('users')
        .doc(data.proposerId)
        .get()
        .then((doc) => {
          return doc.data();
        });
      try {
        const { Status } = await payToDAOStackWallet({
          preAuthId: data.description.preAuthId,
          Amount: data.joinAndQuit.funding,
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
          await updateDAOBalance(data.dao);
          return change.after.ref.set(
            {
              paymentStatus: 'paid',
            },
            { merge: true }
          );
        } else throw new Error('Payment failed');
      } catch (e) {
        console.log('ERROR EXECUTING PRE AUTH PAYMENT', e);
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
