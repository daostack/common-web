const admin = require('firebase-admin');
const fetch = require('node-fetch');

const { CommonError } = require('./errors');
const { env } = require('../constants');

// That was imported from './error', but was not
// there so I don't know what is it
const CFError = {
  invalidIdToken: 'invalidIdToken',
  emptyPaymentData: 'emptyPaymentData',
  emptyCardData: 'emptyCardData',
  emptyUserData: 'emptyUserData'
}


class Utils {

  getCommonLink(commonId) {
    return `https://app.common.io/common/${commonId}`
  }

  getUserRef(uid) {
    return admin.firestore().collection('users').doc(uid);
  }

  getDaoRef(daoId) {
    return admin.firestore().collection('daos').doc(daoId);
  }

  async getUserById(uid) {
    try {
      const userRef = admin.firestore().collection('users').doc(uid);
      const userData = await userRef.get().then(doc => { return doc.data() })
      return userData
    } catch (err) {
      throw new CommonError(CFError.emptyUserData)
    }
  }

  async getCommonById(commonId) {
    try {
      const userRef = admin.firestore().collection('daos').doc(commonId);
      const userData = await userRef.get().then(doc => { return doc.data() })
      return userData
    } catch (err) {
      throw new CommonError(CFError.emptyUserData)
    }
  }

  async getCardById(cardId) {
    const cardRef = admin.firestore().collection('cards').doc(cardId);
    const cardData = await cardRef.get().then(doc => doc.data());
    if (!cardData) {
      throw new CommonError(`Could not find card with id ${cardId}.`)
    }
    return cardData;
  }

  async getCardByUserId(userId) {
    const cardRef = await admin.firestore().collection('cards')
      .where('userId', '==', userId)
      .get();
        if (cardRef.docs.length === 0) {
          throw new CommonError(`Could not find user with id ${userId} associated with a CirclePay card.`);
        }
    const cardData = cardRef.docs.map(doc => doc.data())[0];
    return cardData;
  }

  async getCardByProposalId(proposalId) {
    try {
      const cardRef = await admin.firestore().collection('cards')
        .where('proposals', 'array-contains', proposalId)
        .get();
      const cardData = cardRef.docs.map(doc => doc.data())[0];
      return cardData;
    } catch (err) {
      throw new CommonError(CFError.emptyUserData)
    }
  }

  async getPaymentById(paymentId) {
    try {
      const paymentRef = await admin.firestore().collection('payments')
        .where('id', '==', paymentId)
        .get();
      const paymentData = paymentRef.docs.map(doc => doc.data())[0];
      return paymentData;
    } catch (err) {
      throw new CommonError(CFError.emptyUserData)
    }
  }
}

module.exports = {
  Utils: new Utils(),
  DAO_REGISTERED: 'registered'
}
