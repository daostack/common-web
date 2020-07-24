const Relayer = require('./relayer');
const Utils = require('../util/util');
const { env } = require('../env');
const ethers = require('ethers');
const abi = require('./abi.json');
const { provider } = require('../settings.js');

const setAllowance = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {

    console.log('---setAllowance---')

    const {
      idToken,
      approveCommonTokenTx, // This is the signed transaction to set the allowance.
      createProposalTx, // This is the address to send the proposal 
    } = req.body;
    const uid = await Utils.verifyId(idToken)
    const userData = await Utils.getUserById(uid);
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress

    await Relayer.addAddressToWhitelist([approveCommonTokenTx.to, createProposalTx.to]);

    // set the allowance
    const response = await Relayer.execTransaction(
      safeAddress, 
      ethereumAddress, 
      approveCommonTokenTx.to, 
      approveCommonTokenTx.value, 
      approveCommonTokenTx.data, 
      approveCommonTokenTx.signature
    )

    if (response.status !== 200) {
      // TODO: please do not return the tx.hash here, which is the has from the minting transaction which ahppend earlier
      // res.status(500).send({ error: 'Approve address failed', errorCode: 102 })
      return
    }
    // Wait for the allowance to be confirmed
    const receipt = await provider.waitForTransaction(response.data.txHash)

    let contract = new ethers.Contract(env.commonInfo.commonToken, abi.CommonToken, provider);
    let allowance = await contract.allowance(safeAddress, createProposalTx.to);

    return {txHash: receipt.transactionHash, allowance: allowance.toString(10)}

  } catch (error) {
    throw error; 
  }
}

module.exports = { setAllowance };
