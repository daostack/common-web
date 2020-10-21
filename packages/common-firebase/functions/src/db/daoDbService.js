const {env} = require('../env');
const ethers = require('ethers');
const abi = require('../relayer/util/abi.json');
const { provider, db } = require('../settings');
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

const getBalance = async (daoId) => {
    const wallet = await getTokenBalance(daoId);
    return wallet
};

const getTokenBalance = async (daoId) => {
    if (daoId) {
        let contract = new ethers.Contract(env.commonInfo.commonToken, abi.CommonToken, provider);
        const balance = await contract.balanceOf(daoId);
        const balanceStr = balance.toString();
        console.log('DAO Balance ->', balanceStr);
        return balanceStr;
    }
    return 0
};


module.exports = {
    updateDao,
    getDaoById,
    updateDAOBalance,
    getBalance,
};
