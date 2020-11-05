const functions = require('firebase-functions');
const { updateDaoById } = require('../dao');
const { createEvent } = require('../../db/eventDbService');
const { Utils, PROPOSAL_TYPE, DAO_REGISTERED } = require('../../util/util');
const { CommonError } = require('../../util/errors');
const { env } = require('../../env');
const { EVENT_TYPES } = require('../../event/event');
const emailClient = require('../../email');
const { getDiscussionById } = require('../../db/discussionDbService');

exports.newProposalCreated = functions
  .firestore
  .document('/proposals/{id}')
  .onCreate(async (snap) => {
    const proposal = snap.data();
    
    const proposer = await Utils.getUserById(proposal.proposerId);
    if(proposal.type === PROPOSAL_TYPE.Join) {
      const common = await Utils.getCommonById(proposal.dao);

      if(!common) {
        throw new CommonError(`
          New proposal was created from user (${proposal.proposerId}) 
          in common (${proposal.dao}), but the common was not found. 
          Created proposal id is ${proposal.id}
        `);
      }

      await createEvent({
        userId: proposer.uid,
        objectId: proposal.id,
        createdAt: new Date(),
        type: EVENT_TYPES.CREATION_REQUEST_TO_JOIN
      });
    }

    if (proposal.type === PROPOSAL_TYPE.FundingRequest) {
        await createEvent({
          userId: proposer.uid,
          objectId: proposal.id,
          createdAt: new Date(),
          type: EVENT_TYPES.CREATION_PROPOSAL
        });
    }
  })

exports.watchForNewMembers = functions.firestore
  .document('/proposals/{id}')
  .onUpdate(async (change) => {
    const data = change.after.data();
    const previousData = change.before.data();
    if (
      data.type === PROPOSAL_TYPE.Join &&
      previousData.join.reputationMinted !== data.join.reputationMinted
    ) {
      console.log(
        'Join proposal reputationMinted changed from "0" Initiating DAO update'
      );
      await createEvent({
        userId: data.proposerId,
        objectId: data.id,
        createdAt: new Date(),
        type: EVENT_TYPES.APPROVED_REQUEST_TO_JOIN
      });
      
      try {
        await updateDaoById(data.dao);
      } catch (e) {
        console.error(e);
      }
    }

    if (
      data.type === PROPOSAL_TYPE.FundingRequest &&
      previousData.join.reputationMinted === '0' &&
      data.join.reputationMinted !== '0'
    ) {
      console.log(
        'Funding proposal reputationMinted changed from "0" Initiating DAO update'
      );
      await createEvent({
        userId: data.proposerId,
        objectId: data.id,
        createdAt: new Date(),
        type: EVENT_TYPES.APPROVED_PROPOSAL
      });
      
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

    if (dao.register === DAO_REGISTERED && (dao.register !== oldDao.register)) {
      const creator = await Utils.getUserById(dao.members[0].userId);

      await createEvent({
        userId: creator.uid,
        objectId: dao.id,
        createdAt: new Date(),
        type: EVENT_TYPES.COMMON_WHITELISTED
      });
    }
  });

// exports.newDaoCreated = functions.firestore
//   .document('/daos/{id}')
//   // eslint-disable-next-line consistent-return
//   .onCreate(async (snap) => {
//     let newDao = snap.data();

//     const userId = newDao.members[0].userId;
//     const userData = await Utils.getUserById(userId);
//   });

  // exports.newDaoCreated = functions.firestore
  // .document('/discussionMessage/{id}')
  // .onCreate(async (snap) => {
  //   let newMessage = snap.data();

  //   const discussion = getDiscussionById(newMessage.discussionId);
    
  //   await createEvent({
  //     userId: newMessage.ownerId,
  //     objectId: newMessage.id,
  //     createdAt: new Date(),
  //     type: EVENT_TYPES.CREATION_COMMON
  //   });
  // });