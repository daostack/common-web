const { db } = require('../settings.ts');
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

module.exports = {
    findUserByAddress,
    getUserById,
    updateUser
};
