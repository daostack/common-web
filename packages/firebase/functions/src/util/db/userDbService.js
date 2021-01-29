// @ts-ignore
const { db } = require('../../settings');
const COLLECTION_NAME = 'users';

async function getUserById(userId) {
    return await db.collection(COLLECTION_NAME)
        .doc(userId)
        .get();
}

async function findUserByAddress(ethereumAddress, key = 'safeAddress') {
    const query = db.collection(COLLECTION_NAME)
        .where(key, `==`, ethereumAddress)

    const snapshot = await query.get()
    if (snapshot.size === 0) {
        // eslint-disable-next-line no-console
        console.error(`No member found with ${key} === ${ethereumAddress}`)
        return null
    } else {
        const member = snapshot.docs[0]
        return member
    }
}

async function updateUser(userId, doc) {

    return await db.collection(COLLECTION_NAME)
        .doc(userId).
        set(
            doc,
            {
                merge: true
            }
        );
}

async function getAllUsers() {
    const snapshot = await db.collection(COLLECTION_NAME).get();
    return snapshot.docs.map(doc => doc.data());
}

module.exports = {
    findUserByAddress,
    getUserById,
    updateUser,
    getAllUsers
};
