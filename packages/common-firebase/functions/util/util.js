const admin = require('firebase-admin');
const { CommonError, CFError} = require('./error')

module.exports = new class Utils {
  async verifyId(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken)
      const uid = decodedToken.uid;
      return uid
    } catch (error) {
      throw new CommonError(CFError.invalidIdToken)
    }
  }
  
  geyUserReference(uid) {
    return admin.firestore().collection('users').doc(uid);
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

  getTransactionEvents(interf, receipt) {
    const txEvents = {};
    const abiEvents = Object.values(interf.events);
    for (const log of receipt.logs) {
      for (const abiEvent of abiEvents) {
        if (abiEvent.topic === log.topics[0]) {
          txEvents[abiEvent.name] = abiEvent.decode(log.data, log.topics);
          break;
        }
      }
    }
    return txEvents;
  }

  async isRelayerTxSuccess(txHash) {
    const receipt = await this.provider.waitForTransaction(txHash);
    return this.isRelayerTxSuccessWithReceipt(receipt);
  }
  
   isRelayerTxSuccessWithReceipt(receipt) {
    const ExecutionFailureTopic = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23';
    for (const log of receipt.logs) {
      if (log.topics[0] === ExecutionFailureTopic) {
        return false;
      }
    }
    return true;
  }
}
