const { mangopayClient } = require('../util/mangoPay');
const admin = require('firebase-admin');
const db = admin.firestore();

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
    const { balance } = await getBalance(daoId);

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
    const wallet = await getCurrentDaoWallet(daoId);

    return wallet
        ? wallet.Balance.Amount
        : 0
};


module.exports = {
    updateDao,
    getDaoById,
    updateDAOBalance,
    getCurrentDaoWallet,
    getBalance,
};
