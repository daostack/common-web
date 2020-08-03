const Relayer = require('./relayer');
const Utils = require('../util/util');

const createWallet = async req => {
  // eslint-disable-next-line no-useless-catch
  try {
    const idToken = req.header('idToken');
    const uid = await Utils.verifyId(idToken)
    const userRef = Utils.getUserRef(uid);
    const userData = await Utils.getUserById(uid);
    const address = userData.ethereumAddress
    const response = await Relayer.createWallet(address)
    const txHash = response.data.txHash
    const safeAddress = await Relayer.getAddressFromEvent(txHash)
    await userRef.update({ safeAddress: safeAddress.toLowerCase() })
    await Relayer.addAddressToWhitelist([address]);
    const whitelist = await Relayer.addProxyToWhitelist([safeAddress]);
    return { whitelistMsg: whitelist.data.message, createWalletTx: txHash, safeAddress}
  } catch (error) {
    throw error; 
  }
}

 module.exports = { createWallet };
