const admin = require('firebase-admin');
const { provider } = require('../settings')
const { CommonError, CFError} = require('./error')
const fetch = require('node-fetch');
const { env } = require('@env');

const QUERY_LATEST_BLOCK_NUMBER = `query {
  indexingStatusForCurrentVersion(subgraphName: "${env.graphql.subgraphName}") { 
    chains { 
      network ... on EthereumIndexingStatus { 
        latestBlock { 
          number 
        } 
        chainHeadBlock { 
          number  
        } 
      } 
    } 
  } 
}`;

module.exports = new class Utils {

  getCommonLink(commonId)  {
    return `https://app.common.io/common/${commonId}`
  }
  
  async verifyId(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken)
      return decodedToken.uid;
    } catch (error) {
      throw new CommonError(CFError.invalidIdToken)
    }
  }
  
  async getUserDataByIdToken(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken)
      return await this.getUserById(decodedToken.uid);
    } catch (error) {
      throw new CommonError(CFError.invalidIdToken)
    }
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
    const receipt = await provider.waitForTransaction(txHash);
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
  
  async getGraphLatestBlockNumber() {
    const response = await fetch( env.graphql.graphApiUrl, {
      method: 'POST',
      body: JSON.stringify({ query: QUERY_LATEST_BLOCK_NUMBER }),
      headers: { 'Content-Type': 'application/graphql' },
    });  

    const graphData = await response.json();
    const blockNumber = graphData.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number;
    return Number(blockNumber);
  }
}
