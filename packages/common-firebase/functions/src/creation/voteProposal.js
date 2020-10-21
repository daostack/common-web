// const Utils = require('../util/util');
const { CommonError } = require('../util/errors');
const { provider } = require('../settings');
const { execTransaction } = require('../relayer/util/execTransaction');
const { Utils } = require('../util/util');
const { updateProposalById } = require('../graphql/proposal');
const { getArc, PROPOSAL_TYPE, PROPOSAL_STAGES_HISTORY, NULL_ADDRESS } = require('../settings');
const { JoinProposal, FundingRequestProposal } = require('@daostack/arc.js');

const createVoteProposalTransaction = async (req) => {
  const arc = await getArc();

  const {
    idToken,
    proposalId,
    data,
    proposalType
  } = req.body;
  const uid = await Utils.verifyId(idToken);
  const userData = await Utils.getUserById(uid);

  let proposal;
  if (proposalType === PROPOSAL_TYPE.Join) {
    proposal = new JoinProposal(arc, proposalId);
  } else {
    proposal = new FundingRequestProposal(arc, proposalId);
  }

  const errorHandler = async () => {
    const proposalState = await proposal.fetchState();
    if (proposalState.stage in PROPOSAL_STAGES_HISTORY) {
      throw new CommonError(
        `Cannot vote: the proposal ${proposalId} has been already executed, or it expired`
      );
    }
    // check if the user is a member of the Common
    const voter = userData.safeAddress;
    const dao = proposalState.dao.entity;
    const daoState = await dao.fetchState();
    const reputation = await daoState.reputation.entity;
    const reputationContract = await reputation.contract();
    const reputationBalance = await reputationContract.balanceOf(voter);
    if (Number(reputationBalance) === 0) {
      throw new CommonError(
        `Voting failed because you (${voter}) are not a member of this DAO (${dao.id}) - rep: ${reputationBalance}`
      );
    }
  };

  // TODO: error Handler shoudl only be called in case an error occurred, once https://daostack1.atlassian.net/browse/CM-402 is implemented
  // .. we are runnning the error handler here to check conditions before sending the transaction ...
  // .. this is expensive, and once we have reduced such errors to the minimmum, we should to error handling only ...
  // .. when the transaction actually failed
  console.log('checking preconditions for voting');
  await errorHandler();
  console.log('creating the vote transaction');

  const contract = await proposal.votingMachine();
  const params = [
    proposal.id, // proposalId
    data.vote, // a value between 0 to and the proposal number of choices.
    '0', // amount of reputation to vote with . if _amount == 0 it will use all voter reputation.
    NULL_ADDRESS
  ];

  const encodedData = contract.interface.functions.vote.encode(params);
  const safeTxHash = await Utils.createSafeTransactionHash(userData.safeAddress, contract.address, 0, encodedData);
  // console.log('safeTxHash -->', safeTxHash);
  return {
    encodedData: encodedData,
    toAddress: contract.address,
    safeTxHash: safeTxHash
  };
};

const voteProposal = async (req) => {
  console.log(`voteProposal started`)
  const { encodedData, signedData, idToken, toAddress, proposalId } = req.body;
  const request = {
    body: {
      to: toAddress,
      value: '0',
      data: encodedData,
      signature: signedData,
      idToken: idToken
    }
  };
  const response = await execTransaction(request);
  const receipt = await provider.waitForTransaction(response.txHash);
  console.log(`call updateProposalById`)
  await updateProposalById(proposalId, { retries: 8 }, receipt.blockNumber);
  console.log(`voteProposal done`)
  return { receipt };
};

module.exports = { createVoteProposalTransaction, voteProposal };