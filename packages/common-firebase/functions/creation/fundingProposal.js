// const Utils = require('../util/util');
const { env } = require('@env');
const { Utils } = require('../util/util');
const { IpfsClient, provider, getArc, PROPOSAL_TYPE } = require('../settings');
const { updateProposalById } = require('../graphql/proposal');
const { first } = require('rxjs/operators');
const ethers = require('ethers');
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
    throw Error(`Canot create a funding request as the plugin is not actived yet (it activates on ${activationTime})`);
  }

  // TODO: The "FUNDED_BEFORE_DEADLINE" flag can (and should) be set on common creation, not on "first proposal creation"
  let fundingGoalReachedFlag = await daoContract.functions.db('FUNDED_BEFORE_DEADLINE');
  if (fundingGoalReachedFlag !== 'TRUE') {
    const errorJoinPlugin = await dao.plugin({
      where: { name: PROPOSAL_TYPE.Join },
    });
    console.log(`fundingGoalReachedFlag is not TRUE (its value is "${fundingGoalReachedFlag}") - so we cannot create a proposal`);

    const fundingGoal = Number(joinPluginState.pluginParams.fundingGoal);
    console.log(`funding goal: ${fundingGoal}`);
    if (fundingGoal !== 0) {
      throw Error(`Invalidly configured DAO - funding goal is not 0, it is ${fundingGoal} instead`);
    }

    // TODO: check fundingGoal < dao.balance ?

    if (joinPluginState.pluginParams.fundingGoalDeadline < new Date()) {
      throw Error('Invalidly configured DAO - cannot create funding request (the fundingGoalDeadline of the join plugin is in the past, so we cannot set the fundingGoalReeched flag to true)');
    }
    console.log('We will try to reset the fundingGoalReachedFlag');
    const joinContract = await arc.getContract(errorJoinPlugin.coreState.address);
    const encodedData = joinContract.interface.functions.setFundingGoalReachedFlag.encode([]);
    const safeTxHash = await Utils.createSafeTransactionHash(safeAddress, joinContract.address, '0', encodedData);
    const setFlagTx = { encodedData, safeTxHash, toAddress: joinContract.address }

    return setFlagTx;
  }
  return null;
}

const createFundingProposalTransaction = async (req) => {
  const arc = await getArc();
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      idToken,
      daoId,
      data
    } = req.body;

    const uid = await Utils.verifyId(idToken);
    const userData = await Utils.getUserById(uid);
    const IPFS_DATA_VERSION = env.graphql.ipfsDataVersion;
    const dao = arc.dao(daoId);
    
    let fundingRequestPlugin;
    try {
      fundingRequestPlugin = await dao.plugin({
        where: { name: 'FundingRequest' },
      });
    } catch (e) {
      console.log(e);
      console.log(daoId);
      const catchPlugins = await dao
        .plugins()
        .pipe(first())
        .toPromise();
      console.log(catchPlugins.map((p) => p.coreState.name));
      throw e;
    }

    console.log('fundingRequestPlugin', fundingRequestPlugin.id);

    const funding = data.funding;
    if (!funding) {
      throw Error('"funding" argument must be given');
    }

    // TODO: check if the user is a member
    const ipfsdata = {...data, VERSION: IPFS_DATA_VERSION};
    const ipfsHash = await IpfsClient.addAndPinString({description: JSON.stringify(ipfsdata)});
    console.log('ipfsHash', ipfsHash);

    const params = {
      descriptionHash: ipfsHash,
      amount: funding,
      beneficiary: userData.safeAddress,
      dao: dao.id,
      plugin: fundingRequestPlugin.coreState.address,
    };

    const setFlagTx = await fundingCheck(dao.id, userData.safeAddress);
    // send the acdtual transaction
    const { contract, method, args } = await fundingRequestPlugin.createProposalTransaction(params);
    const encodedData = contract.interface.functions[method].encode(args);

    // To avoid 2 tx in same time with same nonce will failed the second one
    // We need check the setFlagTx is null or not.
    const useNextNonce = setFlagTx === null ? false : true;
    const safeTxHash = await Utils.createSafeTransactionHash(userData.safeAddress, contract.address, '0', encodedData, useNextNonce);
    
    return { fundingRequestTx: { encodedData, safeTxHash, toAddress: contract.address }, setFlagTx }
  } catch (error) {
    throw error; 
  }
}

const createFundingProposal = async (req) => {
  const arc = await getArc();
  // eslint-disable-next-line no-useless-catch
  try {
    console.log('---Funding Proposal---');
    const {
      idToken,
      daoId,
      fundingRequestTx, // This is the signed transacxtion to create the proposal. 
      setFlagTx,
    } = req.body;

    const waitForSetFlagTx = async () => {
      if (!setFlagTx) {
        return;
      }
      console.log('--- Execute setFlagTx ---');
      const reqest1 = {
        body: {
          to: setFlagTx.toAddress,
          value: '0',
          data: setFlagTx.encodedData,
          signature: setFlagTx.signedData,
          idToken: idToken,
        }
      }
      const response = await execTransaction(reqest1);
      await provider.waitForTransaction(response.txHash);
    }

    await waitForSetFlagTx();
    console.log('--- Execute fundingRequestTx ---');
    const daoContract = await arc.getContract(daoId);
    const fundingGoalReachedFlag = await daoContract.db('FUNDED_BEFORE_DEADLINE');
    if (fundingGoalReachedFlag !== 'TRUE') {
      throw Error('funding goal is not reached yet - cannot create a funding request');
    }  

    const reqest2 = {
      body: {
        to: fundingRequestTx.toAddress,
        value: '0',
        data: fundingRequestTx.encodedData,
        signature: fundingRequestTx.signedData,
        idToken: idToken,
      }
    }
    const response = await execTransaction(reqest2);
    console.log('response -->', response);

    const ARC_VERSION = env.commonInfo.arcVersion;
    const abi = arc.getABI({abiName: 'FundingRequest', version: ARC_VERSION});
    const interf = new ethers.utils.Interface(abi);

    const receipt = await provider.waitForTransaction(response.txHash);
    const events = Utils.getTransactionEvents(interf, receipt);
    
    if (!events.NewFundingProposal) {
      throw Error('Expected (but did not find a NewFundingProposal event: something went wrong');
    }
    const proposalId = events.NewFundingProposal._proposalId;
    await updateProposalById(proposalId, { retries: 8 });
    return { proposalId };
  } catch (error) {
    console.error('Request to join failed')
    throw error;
  }
}

module.exports = { createFundingProposalTransaction, createFundingProposal };
