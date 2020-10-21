const functions = require('firebase-functions');
const { updateDAOBalance } = require("../db/daoDbService");
const { minterToken } = require('../relayer/util/minterToken')
const { Utils } = require('../util/util');

const emailClient = require('.');

exports.watchForExecutedProposals = functions.firestore
  .document('/proposals/{id}')
  .onUpdate(async (change) => {
    const data = change.after.data();
    const previousData = change.before.data();

    if (
      data.executed !== previousData.executed &&
      data.executed === true &&
      data.winningOutcome === 1 
      // && data.description.preAuthId
    ) {
      console.log(
        'Proposal EXECUTED and WINNING OUTCOME IS 1 -> INITIATING PAYMENT'
      );
      const userData = await Utils.getUserById(data.proposerId);
      let daoData = await Utils.getCommonById(data.dao);
      try {
        const amount = data.description.funding;
        await Promise.all([
          emailClient.sendTemplatedEmail({
            to: userData.email,
            templateKey: "userJoinedSuccess",
            emailStubs: {
              name: userData.displayName,
              commonName: daoData.name,
              commonLink: Utils.getCommonLink(daoData.id)
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

        console.log(`Minting ${amount} tokens to ${data.dao}`)
        await minterToken(data.dao, amount)
        await updateDAOBalance(data.dao);
        return change.after.ref.set(
          {
            paymentStatus: 'paid',
          },
          { merge: true }
        );

      } catch (e) {

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
       // await cancelPreauthorizedPayment(data.description.preAuthId);
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
            userEmail: userData.email,
            commonName: daoData.name,
            commonBalance: daoData.balance,
            commonLink: Utils.getCommonLink(daoData.id),
            commonId: daoData.id,
            proposalId: data.id,
            paymentAmount: data.fundingRequest.amount,
            submittedOn: new Date(data.createdAt * 1000).toDateString(),
            passedOn: new Date(data.executedAt * 1000).toDateString(),
            log: 'No additional information available',
            paymentId: 'Not available'
          }
        })
      ])
    }

    return true;
  });
