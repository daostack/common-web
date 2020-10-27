// const Utils = require('../util/util');
const { IpfsClient, provider, getArc } = require('../settings');
const { env } = require('../env');
const DAOFactoryABI = require('@daostack/common-factory/abis/DAOFactory');
const { CommonError } = require('../util/errors');
const { getForgeOrgData } = require('@daostack/common-factory');
const { execTransaction } = require('../relayer/util/execTransaction');
const { Utils } = require('../util/util');
const { updateDaoById } = require('../graphql/dao');

const createCommonTransaction = async (req) => {

  const {
    idToken,
    data
  } = req.body;

  let uid, userData;

  if (env.environment === 'dev') {
    if (!data) {
      throw new CommonError('Cannot create a common without the needed data!');
    }

    userData = req.body.user;
    userData.safeAddress = data.founderAddresses;
  } else {
    uid = await Utils.verifyId(idToken);
    userData = await Utils.getUserById(uid);
  }

  const REP_DIST = [1000]; 
  // TODO: we want to change this and set it to 0, and mint the repution when the proposalis accepted (and the payment succeeded)
  const MEMBER_REPUTATION = 1000;
  const COMMONTOKENADDRESS = env.commonInfo.commonToken;
  const IPFS_DATA_VERSION = env.graphql.ipfsDataVersion;
  const ARC_VERSION = env.commonInfo.arcVersion;

  // need these keys:
  const defaultOptions = {
    tokenDist: [ 0 ],
    repDist: REP_DIST ,
    memberReputation: MEMBER_REPUTATION,
    fundingToken: COMMONTOKENADDRESS,
    VERSION: IPFS_DATA_VERSION // just some alphanumberic marker  that is useful for understanding what our data is shaped like
  };
  const opts = { ...defaultOptions, ...data };
  console.log('saving data on ipfs');
  const ipfsHash = await IpfsClient.addAndPinString(opts);
  if (!ipfsHash) {
    throw CommonError("IPFS hash is empty - something went wrong calling addAndPintString")
  }

  const arc = await getArc();

  const daoFactoryInfo = arc.getContractInfoByName(
    'DAOFactoryInstance',
    ARC_VERSION
  );

  const daoFactoryContract = await arc.getContract(
    daoFactoryInfo.address,
    DAOFactoryABI
  );

  const votingMachineInfo = arc.getContractInfoByName(
    'GenesisProtocol',
    ARC_VERSION
  );

  console.log('Calling DAOFactory.forgeOrg(...)');
  const args = {
    DAOFactoryInstance: daoFactoryInfo.address,
    orgName: opts.name,
    founderAddresses: [ opts.founderAddresses ],
    repDist: REP_DIST,
    votingMachine: votingMachineInfo.address,
    fundingToken: opts.fundingToken,
    minFeeToJoin: 0, // Make the min fee to 0, simplify request to join logic
    memberReputation: MEMBER_REPUTATION,
    // we set the OFFICIAL funding goal to 0 - in the frontend we show the fundingGaol from ipfs data
    // goal: parseInt(opts.fundingGoal, 10),
    goal: 0,
    deadline: opts.fundingGoalDeadline,
    metaData: ipfsHash
  };
  const params = getForgeOrgData(args);
  const encodedData = daoFactoryContract.interface.functions.forgeOrg.encode(params);

  const safeTxHash = await Utils.createSafeTransactionHash(userData.safeAddress, daoFactoryContract.address, 0, encodedData);
  console.log(`createCommonTransaction done`);
  return {
    encodedData: encodedData,
    toAddress: daoFactoryContract.address,
    safeTxHash: safeTxHash
  };

};

const createCommon = async (req) => {
  const { encodedData, signedData, idToken, toAddress } = req.body;
  const reqest = {
    body: {
      to: toAddress,
      value: '0',
      data: encodedData,
      signature: signedData,
      idToken: idToken
    }
  };

  const ARC_VERSION = env.commonInfo.arcVersion;
  const arc = await getArc();
  const daoFactoryInfo = arc.getContractInfoByName(
    'DAOFactoryInstance',
    ARC_VERSION
  );

  const daoFactoryContract = await arc.getContract(
    daoFactoryInfo.address,
    DAOFactoryABI
  );

  const response = await execTransaction(reqest);
  const receipt = await provider.waitForTransaction(response.txHash);
  const events = Utils.getTransactionEvents(daoFactoryContract.interface, receipt);
  const newOrgEvent = events.NewOrg;
  const daoId = newOrgEvent._avatar;

  await updateDaoById(daoId, { retries: 8 });
  return { daoId };
};

module.exports = { createCommonTransaction, createCommon };