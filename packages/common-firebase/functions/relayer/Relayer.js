const ethers = require('ethers');
const abi = require('./abi.json');
const axios = require('axios');
const { env } = require('../env');
const { jsonRpcProvider } = require('../settings');

const provider = new ethers.providers.JsonRpcProvider(jsonRpcProvider);
const zeroAddress = `0x${'0'.repeat(40)}`;
const options = { headers: { 'x-api-key': env.biconomy.apiKey, 'Content-Type': 'application/json' } }

module.exports = new class Relayer {

  handleAxiosError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
      return error.request;
    } 

    return new CommonError();
  }

  async createWallet(address) {
    try {
      const iface = new ethers.utils.Interface(abi.MasterCopy);
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
      const data = {
        'apiId': env.biconomy.createProxy,
        'to': env.biconomy.proxyFactory,
        'from': address,
        'params': [env.biconomy.masterCopy, encodedData]
      }
      return await axios.post('https://api.biconomy.io/api/v2/meta-tx/native', data, options) 
    } catch (error) {
      throw this.handleAxiosError(error);
    }
  }

  async execTransaction(safeWallet, localWallet, to, value, dataHash, signature) {

    const params = {
      to, 
      value,
      dataHash,
      operation: 0,
      safeTxGas: 0,
      dataGas: 0,
      gasPrice: 0,
      gasToken: zeroAddress,
      refundReceiver: zeroAddress,
      signature
    }

    const data = { 
      'apiId': env.biconomy.execTransaction,
      'to': safeWallet,
      'from': localWallet,
      'params': Object.values(params),
      //TODO: Replace with calculate value
      'gasLimit': '0x989680' // 10000000
    }
    return await axios.post('https://api.biconomy.io/api/v2/meta-tx/native', data, options)
  }

  async createSafeTransactionHash(mySafeWallet, toAddress, value, data) {
    const masterCopyContract = new ethers.Contract(
      mySafeWallet,
      abi.MasterCopy,
      provider,
    );
    const nonce = await masterCopyContract.nonce();
    const SAFE_TX_TYPEHASH = "0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8";
    const DOMAIN_SEPARATOR_TYPEHASH = "0x035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d4749";
    const domainSeperator = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes32", "address"], [DOMAIN_SEPARATOR_TYPEHASH, mySafeWallet]));
    let mySafeTxHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "address", "uint", "bytes32", "uint8", "uint", "uint", "uint", "address", "address", "uint"],
        [SAFE_TX_TYPEHASH, toAddress, value, ethers.utils.keccak256(data), 0, 0, 0, 0, zeroAddress, zeroAddress, nonce]
      )
    );

    let myTxHash = ethers.utils.solidityKeccak256(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      ["0x19", "0x01", domainSeperator, mySafeTxHash]
    );
    return myTxHash;
  }

  async addProxyToWhitelist(addresses) {
    const options = { headers: { 'Authorization': `User ${env.biconomy.whitelistKey}`, 'Content-Type': 'application/json' } }
    const data = { 'addresses': addresses }
    return await axios.post('https://api.biconomy.io/api/v1/dapp/whitelist/proxy-contracts', data, options)
  }

  async addAddressToWhitelist(addresses) {
    const options = { headers: { 'Authorization': `User ${env.biconomy.whitelistKey}`, 'Content-Type': 'application/json' } }
    const data = { 'destinationAddresses': addresses }
    return await axios.post('https://api.biconomy.io/api/v1/dapp/whitelist/destination', data, options)
  }

  async getAddressFromEvent(hash) {
    const receipt = await provider.waitForTransaction(hash);
    let eventABI = [
      {
        type: 'event',
        name: 'ProxyCreation',
        inputs: [
          {
            type: 'address',
            name: 'proxy',
            internalType: 'contract GnosisSafeProxy',
            indexed: false,
          },
        ],
        anonymous: false,
      },
    ];
    const iface = new ethers.utils.Interface(eventABI);
    const events = receipt.logs.map(log => {
      return iface.parseLog(log);
    });
    const address = events[0].values.proxy;
    return address
  }
}
