const admin = require('firebase-admin');
const fetch = require('node-fetch');
const gql = require('graphql-tag');
const ethers = require('ethers');

const ABI = require('../relayer/util/abi.json');
const { CommonError } = require('./errors');
const { provider } = require('../settings');
const { env } = require('../env');

// That was imported from './error', but was not
// there so I don't know what is it
const CFError = {
  invalidIdToken: 'invalidIdToken'
}

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

class Utils {

  getCommonLink(commonId) {
    return `https://app.common.io/common/${commonId}`
  }

  async verifyId(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken)
      return decodedToken.uid;
    } catch (error) {
      console.error(error);

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

  async getCardById(cardId) {
    try {
      const cardRef = admin.firestore().collection('cards').doc(cardId);
      const cardData = await cardRef.get().then(doc => doc.data());
      return cardData;
    } catch (err) {
      throw new CommonError(CFError.emptyUserData)
    }
  }

  async getCardByUserId(userId) {
    try {
      const cardRef = await admin.firestore().collection('cards')
        .where('userId', '==', userId)
        .get();
      const cardData = cardRef.docs.map(doc => doc.data())[0];
      return cardData;
    } catch (err) {
      console.error('err', err);

      throw new CommonError(CFError.emptyUserData)
    }
  }

  async getCardByProposalId(proposalId) {
    try {
      const cardRef = await admin.firestore().collection('cards')
        .where('proposals', 'array-contains', proposalId)
        .get();
      const cardData = cardRef.docs.map(doc => doc.data())[0];
      return cardData;
    } catch (err) {
      throw CommonError(CFError.emptyUserData)
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
      throw CommonError(CFError.emptyUserData)
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
    const response = await fetch(env.graphql.graphApiUrl, {
      method: 'POST',
      body: JSON.stringify({ query: QUERY_LATEST_BLOCK_NUMBER }),
      headers: { 'Content-Type': 'application/graphql' },
    });

    const graphData = await response.json();
    try {

      const blockNumber = graphData.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number;
      return Number(blockNumber);
    } catch (error) {
      throw new CommonError(`Error trying to fetch latest blocknumber from ${env.graphql.graphApiUrl}: ${error}`)
    }
  }

  async createSafeTransactionHash(myWallet, toAddress, value, data = '0x', useNextNonce = false) {
    const masterCopyContract = new ethers.Contract(
      myWallet,
      ABI.MasterCopy,
      provider,
    );
    const zeroAddress = ethers.constants.AddressZero;
    let nonce = await masterCopyContract.nonce();
    nonce = useNextNonce ? nonce.add(1) : nonce;
    const SAFE_TX_TYPEHASH = '0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8';
    const DOMAIN_SEPARATOR_TYPEHASH = '0x035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d4749';
    const domainSeperator = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['bytes32', 'address'], [DOMAIN_SEPARATOR_TYPEHASH, myWallet]));
    let mySafeTxHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'address', 'uint256', 'bytes32', 'uint8', 'uint256', 'uint256', 'uint256', 'address', 'address', 'uint'],
        [SAFE_TX_TYPEHASH, toAddress, value, ethers.utils.keccak256(data), 0, 0, 0, 0, zeroAddress, zeroAddress, nonce]
      )
    );
    let myTxHash = ethers.utils.solidityKeccak256(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
      ['0x19', '0x01', domainSeperator, mySafeTxHash]
    );
    return myTxHash;
  }
}

module.exports = {
  Utils: new Utils(),
  PROPOSAL_TYPE: {
    Join: 'Join',
    FundingRequest: 'FundingRequest',
  },
  DAO_REGISTERED: 'registered'
}
