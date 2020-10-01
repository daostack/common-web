const Relayer = require('./relayer');
const { Utils } = require('../util/util');
const { updateProposalById } = require('../graphql/proposal');
const ethers = require('ethers');
const { provider } = require('../settings.js');
const { cancelPreauthorizedPayment } = require('../mangopay/mangopay');
const abi = require('./util/abi.json')

const createRequestToJoin = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {

    console.log('---requestToJoin---')

    const {
      idToken,
      createProposalTx, // This is the signed transacxtion to create the proposal. 
      preAuthId,
    } = req.body;
    const uid = await Utils.verifyId(idToken)
    const userData = await Utils.getUserById(uid);
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress

    console.log('--- Add white list ---', createProposalTx.to);

    const repw1 = await Relayer.addAddressToWhitelist([createProposalTx.to]);

    console.log('Add white list Success', repw1)

    const response = await Relayer.execTransaction(
      safeAddress,
      ethereumAddress,
      createProposalTx.to,
      createProposalTx.value,
      createProposalTx.data,
      createProposalTx.signature
    )

    console.log('--- Relayer response ---', response);

    if (response.status !== 200) {
      console.error('Request to join failed, tx rejected in Relayer')
      console.error(response.data)
      res.status(500).send({ error: 'Request to join failed', errorCode: 104, data: response.data })
      cancelPreauthorizedPayment(preAuthId);
      return
    }

    console.log('wait for tx to mined')

    const receipt = await provider.waitForTransaction(response.data.txHash);

    console.log('tx mined', receipt);

    // await arc.fetchContractInfos();
    // const JoinABI = arc.getABI("Join", env.graphql.arcVersion)

    const interf = new ethers.utils.Interface(abi.Join)
    const events = Utils.getTransactionEvents(interf, receipt)

    // TODO:  if the transacdtion reverts, we can check for that here and include that in the error message
    if (!events.JoinInProposal) {
      // TODO: add error handling wrapper
      console.error('Request to join failed, Transaction was mined, but no JoinInProposal event was not found in the receipt')
      res.status(500).send({
        txHash: response.data.txHash,
        error: 'Transaction was mined, but no JoinInProposal event was not found in the receipt'
      })
      return
    }

    const proposalId = events.JoinInProposal._proposalId
    console.debug(`Created proposal ${proposalId}`)

    if (!proposalId) {
      // TODO: add error handling wrapper
      res.status(500).send({
        txHash: response.data.txHash,
        error: 'Transation was mined, but no proposalId was found in the JoinInProposal event'
      });
      console.error('Request to join failed, Transaction was mined, but no proposalId was found in the JoinInProposal event')
      return
    }

    await updateProposalById(proposalId, { retries: 8 });
    // TODO: add error handling wrapper
    res.send({ txHash: response.data.txHash, proposalId: proposalId });
  } catch (error) {
    console.error('Request to join failed')
    throw error;
  }
}

module.exports = { createRequestToJoin };
