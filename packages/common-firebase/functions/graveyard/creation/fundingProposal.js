// const Utils = require('../util/util');
const { env } = require('../env');
const { Utils } = require('../util/util');
const { IpfsClient, provider, getArc, PROPOSAL_TYPE } = require('../settings');
const { updateProposalById } = require('../graphql/proposal');
const { first } = require('rxjs/operators');
const ethers = require('ethers');
const { CommonError } = require('../util/errors');
const { execTransaction } = require('../relayer/util/execTransaction');

const fundingCheck = async (daoId, safeAddress) => {

  const arc = await getArc();
  const dao = arc.dao(daoId);
  const daoContract = await arc.getContract(daoId);

  // lets first check some sanity things about the dao
  const joinPlugin = await dao.plugin({ where: { name: PROPOSAL_TYPE.Join } });
  const joinPluginState = await joinPlugin.fetchState();
  const errorFundingRequestPlugin = await dao.plugin({ where: { name: 'FundingRequest' } });
  const fundingRequestPluginState = await errorFundingRequestPlugin.fetchState();
  const activationTime = fundingRequestPluginState.pluginParams.voteParams.activationTime;

  if (activationTime > ((new Date()).getTime() / 1000)) {
    throw new CommonError(
      `Cannot create a funding request as the plugin is not activated yet (it activates on ${activationTime})`,
      'Cannot create a funding request'
    );
  }

  // TODO: The "FUNDED_BEFORE_DEADLINE" flag can (and should) be set on common creation, not on "first proposal creation"
  let fundingGoalReachedFlag = await daoContract.functions.db('FUNDED_BEFORE_DEADLINE');
  if (fundingGoalReachedFlag !== 'TRUE') {
    const errorJoinPlugin = await dao.plugin({
      where: { name: PROPOSAL_TYPE.Join }
    });
    console.log(`fundingGoalReachedFlag is not TRUE (its value is "${fundingGoalReachedFlag}") - so we cannot create a proposal`);

    const fundingGoal = Number(joinPluginState.pluginParams.fundingGoal);
    console.log(`funding goal: ${fundingGoal}`);
    if (fundingGoal !== 0) {
      throw new CommonError(`Invalidly configured DAO - funding goal is not 0, it is ${fundingGoal} instead`);
    }

    // TODO: check fundingGoal < dao.balance ?

    if (joinPluginState.pluginParams.fundingGoalDeadline < new Date()) {
      throw new CommonError('Invalidly configured DAO - cannot create funding request (the fundingGoalDeadline of the join plugin is in the past, so we cannot set the fundingGoalReeched flag to true)');
    }
    console.log('We will try to reset the fundingGoalReachedFlag');
    const joinContract = await arc.getContract(errorJoinPlugin.coreState.address);
    const encodedData = joinContract.interface.functions.setFundingGoalReachedFlag.encode([]);
    const safeTxHash = await Utils.createSafeTransactionHash(safeAddress, joinContract.address, '0', encodedData);
    const setFlagTx = { encodedData, safeTxHash, toAddress: joinContract.address };

    return setFlagTx;
  }
  return null;
};

const createFundingProposalTransaction = async (req) => {
  const arc = await getArc();

  const {
    idToken,
    daoId,
    data
  } = req.body;

  const uid = await Utils.verifyId(idToken);
  const userData = await Utils.getUserById(uid);
  const IPFS_DATA_VERSION = env.graphql.ipfsDataVersion;
  const dao = arc.dao(daoId);

  const fundingRequestPlugin = await dao.plugin({
      where: {
        name: 'FundingRequest'
      }
  });

  console.log('fundingRequestPlugin', fundingRequestPlugin.id);

  const funding = data.funding;
  if (!funding && funding !== 0) {
    throw new CommonError(
      'The funding argument was not provided!'
    );
  }

  // TODO: check if the user is a member
  const ipfsData = { ...data, VERSION: IPFS_DATA_VERSION };
  const ipfsHash = await IpfsClient.addAndPinString({
    description: JSON.stringify(ipfsData)
  });

  console.log('ipfsHash', ipfsHash);

  const params = {
    descriptionHash: ipfsHash,
    amount: funding,
    beneficiary: userData.safeAddress,
    dao: dao.id,
    plugin: fundingRequestPlugin.coreState.address
  };

  const setFlagTx = await fundingCheck(dao.id, userData.safeAddress);
  // send the actual transaction
  const { contract, method, args } = await fundingRequestPlugin.createProposalTransaction(params);
  const encodedData = contract.interface.functions[method].encode(args);

  // To avoid 2 tx in same time with same nonce will failed the second one
  // We need check the setFlagTx is null or not.
  const useNextNonce = setFlagTx !== null;
  const safeTxHash = await Utils.createSafeTransactionHash(userData.safeAddress, contract.address, '0', encodedData, useNextNonce);

  return {
    setFlagTx,
    fundingRequestTx: {
      toAddress: contract.address,
      encodedData,
      safeTxHash,
    }
  };
};

const createFundingProposal = async (req) => {
  const arc = await getArc();
  const {
    fundingRequestTx, // This is the signed transaction to create the proposal.
    setFlagTx,
    idToken,
    daoId
  } = req.body;

  const waitForSetFlagTx = async () => {
    if (!setFlagTx) return;

    const reqest1 = {
      body: {
        to: setFlagTx.toAddress,
        value: '0',
        data: setFlagTx.encodedData,
        signature: setFlagTx.signedData,
        idToken: idToken
      }
    };
    const response = await execTransaction(reqest1);
    await provider.waitForTransaction(response.txHash);
  };

  await waitForSetFlagTx();

  const daoContract = await arc.getContract(daoId);
  const fundingGoalReachedFlag = await daoContract.db('FUNDED_BEFORE_DEADLINE');

  if (fundingGoalReachedFlag !== 'TRUE') {
    throw new CommonError(
      'funding goal is not reached yet - cannot create a funding request',
      'Cannot create funding request, because the funding goal is not reached yet!'
    );
  }

  const reqest2 = {
    body: {
      to: fundingRequestTx.toAddress,
      value: '0',
      data: fundingRequestTx.encodedData,
      signature: fundingRequestTx.signedData,
      idToken: idToken
    }
  };

  const response = await execTransaction(reqest2);

  const ARC_VERSION = env.commonInfo.arcVersion;
  const abi = arc.getABI({ abiName: 'FundingRequest', version: ARC_VERSION });
  const interf = new ethers.utils.Interface(abi);

  const receipt = await provider.waitForTransaction(response.txHash);
  const events = Utils.getTransactionEvents(interf, receipt);

  if (!events.NewFundingProposal) {
    throw new CommonError(
      'Expected (but did not find a NewFundingProposal event: something went wrong',
      'Something went wrong'
    );
  }
  const proposalId = events.NewFundingProposal._proposalId;
  await updateProposalById(proposalId, { retries: 8 }, receipt.blockNumber);
  return { proposalId };
};

module.exports = { createFundingProposalTransaction, createFundingProposal };
