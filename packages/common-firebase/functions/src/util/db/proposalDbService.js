// @ts-ignore
const { db } = require('../../settings');

const COLLECTION_NAME = 'proposals';

async function getProposalById(proposalId) {
    return await db.collection(COLLECTION_NAME)
        .doc(proposalId)
        .get();
}

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
    updateProposal,
    getProposalById
};
