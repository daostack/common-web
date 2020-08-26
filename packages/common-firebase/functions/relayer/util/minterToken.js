const { provider } = require('../../settings')
const ethers = require('ethers');
const { env } = require('../../env');
const abi = require('./abi.json')

const minterToken = async (address, amount) => {
  // eslint-disable-next-line no-useless-catch
  try {

    console.log('--- minter token called ---');

    const OVERRIDES = {
      gasLimit: 10000000,
      gasPrice: 15000000000,
    };
    let minter = new ethers.Wallet(env.commonInfo.pk, provider);
    let contract = new ethers.Contract(env.commonInfo.commonToken, abi.CommonToken, minter);
    let tx = await contract.mint(address, amount, OVERRIDES); // Amount is USD * 100, so the exact token number
    // TODO: we probably want to send this transaction through the relayer (?)
    let receipt = await tx.wait();

    console.log('--- minter receipt---', receipt);

    return receipt.txHash;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { minterToken };
