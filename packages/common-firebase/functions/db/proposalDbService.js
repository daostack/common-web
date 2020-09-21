const admin = require('firebase-admin');
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })

const COLLECTION_NAME = 'proposals';
async function updateProposal(proposalId, doc) {
    return await db.collection(COLLECTION_NAME)
        .doc(proposalId).
        set(
            doc,
            {
                merge: true
            }
        );
}

module.exports = {
    updateProposal
};
