const {ethers, Contract} = require('ethers');
const { Arc } = require('@daostack/arc.js');
const { env } = require('./env');
const IPFSApiClient = require('./util/IPFSClient')
const gql = require('graphql-tag');
const admin = require('firebase-admin');
const graphHttpLink = env.graphql.graphqlHttpProvider;
const graphwsLink = env.graphql.graphqlWsProvider;
const databaseURL = env.firebase.databaseURL;
const jsonRpcProvider = env.blockchain.jsonRpcProvider;
const ipfsDataVersion = env.graphql.ipfsDataVersion;
const ipfsProvider = env.graphql.ipfsProvider;
const ARC_VERSION = env.commonInfo.arcVersion;
const circlePayApi = env.circlepay.apiUrl;

const adminKeys = require('./env/adminsdk-keys.json');

if(env.environment === 'dev') {
  admin.initializeApp();
} else {
  admin.initializeApp({
    credential: admin.credential.cert(adminKeys),
    databaseURL: databaseURL
  });
}

const db = admin.firestore();

db.settings({ ignoreUndefinedProperties: true})

const retryOptions = {
    retries: 4, // The maximum amount of times to retry the operation. Default is 10.
    factor: 2, // The exponential factor to use. Default is 2.
    minTimeout: 1000, //The number of milliseconds before starting the first retry. Default is 1000.
    randomize: false, //Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
};

const provider = new ethers.providers.JsonRpcProvider(jsonRpcProvider);
const minterWallet = new ethers.Wallet(env.commonInfo.pk, provider);

const arc = new Arc({
  graphqlHttpProvider: graphHttpLink,
  graphqlWsProvider: graphwsLink,
  ipfsProvider: ipfsProvider,
  web3Provider: minterWallet,
});

const getArc = async () => {
  if (arc.contractInfos && arc.contractInfos.length > 0) {
    return arc;
  }
  else {
    await arc.fetchAllContracts(true);
    return arc;
  }
}

Arc.prototype.fetchAllContracts = async function (useCache) {
  
  if (useCache) {
    const contracts = await db.collection('arc').doc('contract').get();
    if (contracts.exists) {
      const allContractInfos = JSON.parse(contracts.data().allContractInfos);
      this.setContractInfos(allContractInfos);
      return
    }
  }

  console.log('Fetching contractInfos from the graph');
  let allContractInfos = [];
  let contractInfos = null;
  let skip = 0;

  do {
    // TODO: I (jelle) made this ugly hack fo adding 0.1.2-rc.7 to the version, to recover from an earlier bug
    // in which we, by accident, created a few commons in this version.
    // In any case, this approach is not scaleable. I thikn we should fetch the contracts as needed, 
    // i.e. cache the contracts singularly as needed, and not as a block
    const query = gql`
    query AllContractInfos {
      contractInfos(first: 1000 skip: ${skip * 1000} where: { version_in: ["${ARC_VERSION}", "0.1.2-rc.7"] }) {
        id
        name
        version
        address
        alias
      }
    }
  `;
    // eslint-disable-next-line no-await-in-loop
    const response = await this.sendQuery(query);
    contractInfos = response.data.contractInfos;
    allContractInfos.push(...contractInfos);
    skip++;
  } while (contractInfos && contractInfos.length > 0);

  const universalContracts = await this.fetchUniversalContractInfos();
  allContractInfos.push(...universalContracts);
  this.setContractInfos(allContractInfos);
  db.collection('arc').doc('contract').set(
    {
      'allContractInfos': JSON.stringify(allContractInfos)
    }
  )
}

const fetchAllContracts = async (useCache) => {
  const arc = await getArc(useCache)
  await arc.fetchAllContracts()
  return arc.contractInfos
}

const IpfsClient = new IPFSApiClient(ipfsProvider);

const PROPOSAL_TYPE = {
  Join: 'Join',
  FundingRequest: 'FundingRequest',
};

const PROPOSAL_STAGE = {
  ExpiredInQueue: '0',
  Executed: '1',
  Queued: '2',
  PreBoosted: '3',
  Boosted: '4',
  QuietEndingPeriod: '5',
};

const PROPOSAL_STAGES_HISTORY = [
  PROPOSAL_STAGE.ExpiredInQueue,
  PROPOSAL_STAGE.Executed,
];

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

module.exports = {
    IpfsClient,
    fetchAllContracts,
    graphwsLink,
    graphHttpLink,
    databaseURL,
    jsonRpcProvider,
    provider,
    retryOptions,
    ipfsDataVersion,
    PROPOSAL_TYPE,
    PROPOSAL_STAGES_HISTORY,
    NULL_ADDRESS,
    db,
    getArc,
    circlePayApi,
}
