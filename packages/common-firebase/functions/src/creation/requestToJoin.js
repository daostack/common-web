const { IpfsClient, provider } = require('../settings');
const { env } = require('../env');
const { Utils } = require('../util/util');
const { getArc, PROPOSAL_TYPE } = require('../settings');
const { updateProposalById } = require('../graphql/proposal');
const { first } = require('rxjs/operators');
const Relayer = require('../relayer/relayer');
const ethers = require('ethers');
const abi = require('../relayer/util/abi.json');
const { CommonError } = require('../util/errors');

// data must look like this
// {
//   title: `A test proposal on ${Date()}`,
//   description: 'Some description',
//   files: [],
//   images: [],
//   links: [], // {title: "title", url: "url"}
//   funding: new BN(100000),
// .  payment: { ... }
// };
const createRequestToJoinTransaction = async (req) => {
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

  let joinPlugin;
  try {
    joinPlugin = await dao.plugin({ where: { name: PROPOSAL_TYPE.Join } });
  } catch (e) {
    console.log(e);
    console.log(daoId);
    const plugins = await dao
      .plugins()
      .pipe(first())
      .toPromise();
    console.log(plugins.map((p) => p.coreState.name));
    throw e;
  }

  console.log('joinPlugin', joinPlugin.id, data.funding);

  // if (!data.funding) {
  //   throw Error('"funding" argument must be given');
  // }
  const ipfsdata = {
    ...data,
    VERSION: IPFS_DATA_VERSION
  };

  console.log('saving ipfs data');
  // not working :-()
  // ipfsHash = await arc.saveIPFSData(data);
  const ipfsHash = await IpfsClient.addAndPinString({
    description: JSON.stringify(ipfsdata)
  });

  console.log('ipfsHash', ipfsHash);

  const params = {
    plugin: joinPlugin.coreState.address,
    descriptionHash: ipfsHash,
    dao: dao.id,
    fee: 0
  };

  const errorHandler = async () => {
    const errorJoinPlugin = await dao.plugin({ where: { name: PROPOSAL_TYPE.Join } });
    const joinContract = await arc.getContract(errorJoinPlugin.coreState.address);
    const proposer = userData.safeAddress;

    console.log('proposer ->', proposer);

    // we check the conditions from the contract

    // require(!fundings[proposer].candidate, "already a candidate");
    const memberFund = await joinContract.membersState(proposer);
    if (memberFund === true) {
      // If this error is thrown from a user action, there is a ui bug:s it means that some action was enabled where it shoudl not
      throw new CommonError(`Cannot create the proposal, because the proposer ${proposer} has already a pending membership request`);
    }

    // require(avatar.nativeReputation().balanceOf(proposer) == 0, "already a member");
    const daoState = await dao.fetchState();
    const reputation = await daoState.reputation.entity;
    var reputationContract = await reputation.contract();
    const reputationBalanceOfProposer = await reputationContract.balanceOf(proposer);
    if (Number(reputationBalanceOfProposer) !== 0) {
      throw new CommonError(`Request to join failed because you (${proposer}) are already a member of this DAO (${dao.id}) - rep: ${reputationBalanceOfProposer}`);
    }

    // const minFeeToJoin = Number(joinPlugin.coreState.pluginParams.minFeeToJoin);
    // if (fee < minFeeToJoin) {
    //   const msg = `fee (${fee}) should be >= minFeeToJoin (${minFeeToJoin})`;
    //   throw Error(msg);
    // }
    // require(_feeAmount >= minFeeToJoin, "_feeAmount should be >= then the minFeeToJoin")
  };

  // TODO: we are runnning the error handler here to check conditions before sending the transaction ...
  // .. this is expensive, and once we have reduced such errors to the minimmum, we should to error handling only ...
  // .. when the transaction actually failed
  console.log('checking precondition for transaction');
  await errorHandler();
  console.log('preconditions are ok - creating the transaction');
  const { contract, method, args } = await joinPlugin.createProposalTransaction(params);
  console.log('Encoding transaction');
  const encodedData = contract.interface.functions[method].encode(args);
  const safeTxHash = await Utils.createSafeTransactionHash(userData.safeAddress, contract.address, '0', encodedData);
  return { encodedData, safeTxHash, toAddress: contract.address };
};

const createRequestToJoin = async (req) => {

  console.log('---requestToJoin---');
  const {
    idToken,
    createProposalTx, // This is the signed transaction to create the proposal.
    preAuthId,
    cardData
  } = req.body;

  const uid = await Utils.verifyId(idToken);
  const userData = await Utils.getUserById(uid);
  const safeAddress = userData.safeAddress;
  const ethereumAddress = userData.ethereumAddress;

  console.log('--- Add white list ---', createProposalTx.to);

  const repw1 = await Relayer.addAddressToWhitelist([ createProposalTx.to ]);

  console.log('Add white list Success', repw1);

  const response = await Relayer.execTransaction(
    safeAddress,
    ethereumAddress,
    createProposalTx.to,
    createProposalTx.value,
    createProposalTx.data,
    createProposalTx.signature
  );

  console.log('--- Relayer response ---', response);

  if (response.status !== 200) {
    console.error('Request to join failed, tx rejected in Relayer');
    console.error(response.data);
    console.error('Request to join failed, Transaction failed in relayer');

    throw new CommonError('Request to join failed, Transaction failed in relayer');
  }

  console.log('waiting for tx to be mined');

  const receipt = await provider.waitForTransaction(response.data.txHash);

  console.log('tx mined', receipt);
  const interf = new ethers.utils.Interface(abi.Join);
  const events = Utils.getTransactionEvents(interf, receipt);

  // TODO:  if the transacdtion reverts, we can check for that here and include that in the error message
  if (!events.JoinInProposal) {
    // TODO: add error handling wrapper
    console.error('Request to join failed, Transaction was mined, but no JoinInProposal event was not found in the receipt');
    throw new CommonError('Transaction was mined, but no JoinInProposal event was not found in the receipt');
  }

  const proposalId = events.JoinInProposal._proposalId;

  console.debug(`Created proposal ${proposalId}`);

  if (!proposalId) {
    // TODO: add error handling wrapper
    throw new CommonError('Request to join failed, Transaction was mined, but no proposalId was found in the JoinInProposal event');
  }

  await updateProposalById(proposalId, { retries: 8 });

  return {
    proposalId,
    txHash: response.data.txHash
  };
};

module.exports = { createRequestToJoinTransaction, createRequestToJoin };