const { mangopayClient } = require('../util/mangoPay');
const db = require('firebase-admin').firestore();

async function updateDAOBalance(daoId) {
    const daoWallet = await getCurrentDaoWallet(daoId);

    await db.collection('daos').doc(daoId).set({
        balance: daoWallet.Balance.Amount
    }, {merge: true})

    return {
        balance: daoWallet.Balance.Amount
    }
}

const getCurrentDaoWallet = async (daoId) => {
    const dao = (await db.collection('daos')
      .doc(daoId).get()).data();

    return mangopayClient.Wallets.get(dao.mangopayWalletId);
};

const getBalance = async (daoId) => {
    const wallet = await getCurrentDaoWallet(daoId);

    return {
        balance: wallet.Balance.Amount
    }
}

module.exports = {
    getBalance,
    updateDAOBalance,
    getCurrentDaoWallet
}
