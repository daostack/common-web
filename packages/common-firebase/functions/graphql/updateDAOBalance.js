const abi = require('../relayer/abi.json');
const { env } = require('../env');
const ethers = require('ethers');
const admin = require('firebase-admin');
const { provider } = require("../settings.js")

const db = admin.firestore()

// async function getBalance(address) {
//     const balance = await provider.getBalance(address)
//     console.log(`Balance of ${address} is ${balance}`)
//     return balance.toNumber()
// }


// get the balance ${address} of the CommonToken
async function getBalance (address) {
    const contract = new ethers.Contract(env.commonInfo.commonToken, abi.CommonToken, provider);
    const balance = await contract.balanceOf(address);
    console.log(`Balance of ${address} is ${balance}`)
    return balance.toNumber();
}

async function updateDAOBalance(daoId) {
    const address = daoId
    const balance = await getBalance(address)
    await db.collection('daos').doc(daoId).set({balance}, {merge: true})
    return {balance}
}

module.exports = {
    getBalance,
    updateDAOBalance
}
