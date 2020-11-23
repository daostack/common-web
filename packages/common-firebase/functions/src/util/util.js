const admin = require('firebase-admin');
const fetch = require('node-fetch');

const { CommonError } = require('./errors');
const { env } = require('../constants');

// That was imported from './error', but was not
// there so I don't know what is it
const CFError = {
  invalidIdToken: 'invalidIdToken',
  emptyPaymentData: 'emptyPaymentData',
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
