const functions = require('firebase-functions');
const {
  payToDAOWallet,
  cancelPreauthorizedPayment,
  createLegalUser,
  createWallet
} = require('../mangopay/mangopay');

const { updateDAOBalance } = require("../db/daoDbService");
const { minterToken } = require('../relayer/util/minterToken')
const { Utils } = require('../util/util');

const emailClient = require('../email');
const sendPreauthorizationFailedEmail = require('../email/sendPreauthorizationFailedEmail');

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
      const userData = await Utils.getUserById(data.proposerId);
      let daoData = await Utils.getCommonById(data.dao);
      try {
        // this block here up to line 46 can be extracted to a method, same is used in graphql's trigger newDaoCreated
        // Skip mangoPay for now
        // if (!daoData.mangopayId) {
        //   const { Id: mangopayId } = await createLegalUser(daoData);
        //   const { Id: mangopayWalletId } = await createWallet(mangopayId);
        //   if (mangopayId && mangopayWalletId) {
        //     const daoRef = await util.getDaoRef(daoData.id);
        //     await daoRef.update({ mangopayId, mangopayWalletId });
        //     daoData = await util.getCommonById(data.dao); // update daoData
        //   } else {
        //     await emailClient.sendTemplatedEmail({
        //       to: 'admin',
        //       templateKey: 'adminWalletCreationFailed',
        //       emailStubs: {
        //         commonName: daoData.name,
        //         commonId: daoData.id
        //       }
        //     })
        //   }
        // }
        
        const amount = data.description.funding;
        await Promise.all([
          emailClient.sendTemplatedEmail({
            to: userData.email,
            templateKey: "userJoinedSuccess",
            emailStubs: {
              name: userData.displayName,
              commonName: daoData.name,
              commonLink: util.getCommonLink(daoData.id)
            }
          }),
          emailClient.sendTemplatedEmail({
            to: 'admin',
            templateKey: 'adminPayInSuccess',
            emailStubs: {
              proposalId: data.id
            }
          })
        ]);

        await minterToken(data.dao, amount)
        await updateDAOBalance(data.dao);
        return change.after.ref.set(
          {
            paymentStatus: 'paid',
          },
          { merge: true }
        );

        // @question Ask about this. Maybe make the whole function async?
        // eslint-disable-next-line
        // const { Status, ...paymentInfo } = await payToDAOWallet({
        //   preAuthId,
        //   Amount: amount,
        //   userData,
        //   daoData
        // });
        // if (Status === 'SUCCEEDED') {
        //   // sendMail(
        //   //   env.mail.adminMail,
        //   //   'Successfull pay-In',
        //   //   `Pay-In successfull for Proposal with ID ${data.id}`
        //   // );
        //   // sendMail(
        //   //   userData.email,
        //   //   'Successfull payment',
        //   //   `Your request to join has been approved and the amount of ${data.joinAndQuit.funding}$ was charged.`
        //   // );

        //   await Promise.all([
        //     emailClient.sendTemplatedEmail({
        //       to: userData.email,
        //       templateKey: "userJoinedSuccess",
        //       emailStubs: {
        //         name: userData.displayName,
        //         commonName: daoData.name,
        //         commonLink: util.getCommonLink(daoData.id)
        //       }
        //     }),
        //     emailClient.sendTemplatedEmail({
        //       to: 'admin',
        //       templateKey: 'adminPayInSuccess',
        //       emailStubs: {
        //         proposalId: data.id
        //       }
        //     })
        //   ]);

        //   await minterToken(data.dao, amount)
        //   await updateDAOBalance(data.dao);
        //   return change.after.ref.set(
        //     {
        //       paymentStatus: 'paid',
        //     },
        //     { merge: true }
        //   );
        // } else {
        //   // Template userJoinedButPaymentFailed
        //   // Template adminJoinedButFailedPayment

        //   await Promise.all([
        //     emailClient.sendTemplatedEmail({
        //       to: 'admin',
        //       templateKey: 'adminJoinedButPaymentFailed',
        //       emailStubs: {
        //         commonId: daoData.id,
        //         commonLink: util.getCommonLink(daoData.id),
        //         commonName: daoData.name,
        //         proposalId: data.id,
        //         userFullName: userData.displayName,
        //         paymentAmount: data.fundingRequest ? data.fundingRequest.amount : 'Unknown',
        //         submittedOn: new Date(data.createAt / 1000).toDateString(),
        //         log: JSON.stringify({
        //           Status,
        //           ...paymentInfo
        //         })
        //       }
        //     }),
        //     emailClient.sendTemplatedEmail({
        //       to: userData.email,
        //       templateKey: 'userJoinedButFailedPayment',
        //       emailStubs: {
        //         name: userData.displayName,
        //         commonName: daoData.name,
        //         commonLink: util.getCommonLink(daoData.id)
        //       }
        //     })
        //   ]);

        //   throw new Error('Payment failed');
        // }
      } catch (e) {
        console.error('ERROR EXECUTING PRE AUTH PAYMENT', e);

        const preAuthId = data.description.preAuthId;

        await sendPreauthorizationFailedEmail(preAuthId, e.message);

        return change.after.ref.set({
          paymentStatus: 'failed',
        }, {
          merge: true
        });
      }
    } else if (
      data.executed !== previousData.executed &&
      data.executed === true &&
      data.winningOutcome === 0
    ) {
      await cancelPreauthorizedPayment(data.description.preAuthId);
    }

    if (
      data.name === "FundingRequest" &&
      data.executed !== previousData.executed &&
      data.winningOutcome === 1 &&
      Boolean(data.executed)
    ) {
      const userData = await Utils.getUserById(data.proposerId);
      let daoData = await Utils.getCommonById(data.dao);

      // Template fundingRequestAccepted (admin & user)
      await Promise.all([
        emailClient.sendTemplatedEmail({
          to: userData.email,
          templateKey: 'userFundingRequestAccepted',
          emailStubs: {
            name: userData.displayName,
            proposal: data.description.title
          }
        }),
        emailClient.sendTemplatedEmail({
          to: 'admin',
          templateKey: 'adminFundingRequestAccepted',
          emailStubs: {
            userId: userData.uid,
            userFullName: userData.displayName,
            commonName: daoData.name,
            commonLink: Utils.getCommonLink(daoData.id),
            commonId: daoData.id,
            paymentAmount: data.fundingRequest.amount,
            submittedOn: new Date(data.createdAt / 1000).toDateString(),
            passedOn: new Date(data.executedAt / 1000).toDateString(),
            log: 'No additional information available'
          }
        })
      ])
    }
  });
