const { Utils } = require('../../util/util');
const Relayer = require('../relayer');
const { CommonError } = require('../../util/errors');

const execTransaction = async req => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { to, value, data, signature, idToken } = req.body;
    const uid = await Utils.verifyId(idToken);
    const userData = await Utils.getUserById(uid);
    const safeAddress = userData.safeAddress
    const ethereumAddress = userData.ethereumAddress
    await Relayer.addAddressToWhitelist([to]);
    const response = await Relayer.execTransaction(safeAddress, ethereumAddress, to, value, data, signature)
    // TODO: Once it failed, it will send detail to client which have apiKey
    const success = await Utils.isRelayerTxSuccess(response.data.txHash)
    if (!success) {
      throw new CommonError(`ExecutionFailure while executing ${response.data.txHash}`)
    }
    return response.data;
  } catch (error) {
    throw error; 
  }
}

 module.exports = { execTransaction };
