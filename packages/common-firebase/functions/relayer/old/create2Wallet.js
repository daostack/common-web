
const ethers = require('ethers');
const { env } = require('../../env');
const abi = require('../util/abi.json')
const Utils = require('../../util/util');
const axios = require('axios');

const create2Wallet = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {

        // TODO: Change this with calculate address
    // SaltNonce need to change
    const idToken = req.header('idToken');
    const uid = await Utils.verifyId(idToken);
    const userData = await Utils.getUserById(uid);
    const address = userData.ethereumAddress
    const options = { headers: { 'x-api-key': env.biconomy.apiKey, 'Content-Type': 'relayerlication/json' } }
    const iface = new ethers.utils.Interface(abi.MasterCopy);
    const zeroAddress = `0x${'0'.repeat(40)}`;
    const encodedData = iface.functions.setup.encode([
      [address],
      1,
      zeroAddress,
      '0x',
      zeroAddress,
      zeroAddress,
      '0x',
      zeroAddress,
    ]);
    const nonceSalt = Math.floor(Math.random() * 10000000000);
    const data = {
      'apiId': env.biconomy.create2Proxy,
      'to': env.biconomy.proxyFactory,
      'from': address,
      'params': [env.biconomy.masterCopy, encodedData, nonceSalt]
    }
    
    const testAddress = ethers.utils.getContractAddress({ from: env.biconomy.proxyFactory, nonce: nonceSalt })
    axios.post('https://api.biconomy.io/api/v2/meta-tx/native', data, options)
    .then(receive => {
      let object = Object.assign(receive.data, { address: testAddress, nonce: nonceSalt })
      res.send(object);
    })
    .catch(err => {
      res.send(err);
    })

  } catch (error) {
    throw error; 
  }
}

module.exports = { create2Wallet }
