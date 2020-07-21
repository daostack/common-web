const Relayer = require('./Relayer');
const Utils = require('../util/util');
const { env } = require('../env');
const ethers = require('ethers');
const { provider, arc } = require('../settings.js');
const { cancelPreauthorizedPayment } = require('../mangopay/mangopay');

const requestToJoin = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const {
      idToken,
      approveCommonTokenTx, // This is the signed transaction to set the allowance.
      createProposalTx, // This is the signed transacxtion to create the proposal. 
      preAuthId
    } = req.body;
    const uid = await Utils.verifyId(idToken)
    const userData = await Utils.getUserById(uid);
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress

    await Relayer.addAddressToWhitelist([approveCommonTokenTx.to, createProposalTx.to]);

    const response = await Relayer.execTransaction(
      safeAddress, 
      ethereumAddress, 
      createProposalTx.to, 
      createProposalTx.value, 
      createProposalTx.data, 
      createProposalTx.signature
    )

    if (response.status !== 200) {
      response.status(500).send({ error: 'Request to join failed', errorCode: 104, data: response.data })
      cancelPreauthorizedPayment(preAuthId);
      return
    }
    
    const receipt = await provider.waitForTransaction(response.data.txHash);
    await arc.fetchContractInfos();
    const JoinAndQuitABI = arc.getABI("JoinAndQuit", env.graphql.arcVersion)
    const interf = new ethers.utils.Interface(JoinAndQuitABI)
    const events = Utils.getTransactionEvents(interf, receipt)
    
    // TODO:  if the transacdtion reverts, we can check for that here and include that in the error message
    if (!events.JoinInProposal) {
      res.status(500).send({ 
        txHash: response.data.txHash, 
        error: 'Transaction was mined, but no JoinInProposal event was found in the receipt'
      })
      return
    }
    
    const proposalId = events.JoinInProposal._proposalId
    console.debug(`Created proposal ${proposalId}`)

  } catch (error) {
    throw error; 
  }
}

 export default requestToJoin;
