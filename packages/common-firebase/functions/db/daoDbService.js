const { mangopayClient } = require('../util/mangoPay');
const admin = require('firebase-admin');
const db = admin.firestore();
const {env} = require('@env');
const ethers = require('ethers');
const abi = require('../relayer/util/abi.json');
const { provider } = require('../settings');
const COLLECTION_NAME = 'daos';

async function updateDao(daoId, doc) {
    return await db.collection(COLLECTION_NAME)
        .doc(daoId).
        set(
            doc,
            {
                merge: true
            }
        );
}

async function getDaoById(daoId) {
    return await db.collection(COLLECTION_NAME)
        .doc(daoId)
        .get();
}

async function updateDAOBalance(daoId) {
    const balance = await getBalance(daoId);

    await db.collection(COLLECTION_NAME)
        .doc(daoId)
        .set({
                balance
            },
            {
                merge: true
            });
    return {
        balance
    };
}

const getCurrentDaoWallet = async (daoId) => {
    const dao = (await getDaoById(daoId)).data();

    if (!dao) {
        return null
    } else if (dao.mangopayWalletId) {
        return mangopayClient.Wallets.get(dao.mangopayWalletId)
    } else {
        return null;
    }
};

const getBalance = async (daoId) => {
    const wallet = await getTokenBalance(daoId);
    return wallet
};

const getTokenBalance = async (daoId) => {
    if (daoId) {
        let contract = new ethers.Contract(env.commonInfo.commonToken, abi.CommonToken, provider);
        const balance = await contract.balanceOf(daoId);
        const balanceStr = ethers.utils.formatEther(balance);
        console.log('DAO Balance ->', balanceStr);
        return balanceStr;
    }
    return 0
};


module.exports = {
    updateDao,
    getDaoById,
    updateDAOBalance,
    getCurrentDaoWallet,
    getBalance,
};
