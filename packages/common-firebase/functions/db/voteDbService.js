
const admin = require('firebase-admin');
const db = admin.firestore();

const COLLECTION_NAME = 'votes';

async function updateVote(voteId, doc) {

    return await db.collection(COLLECTION_NAME)
        .doc(voteId).
        set(
            doc,
            {
                merge: true
            }
        );
}

module.exports = {
    updateVote
};
