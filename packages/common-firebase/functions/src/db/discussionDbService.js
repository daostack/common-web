const { db } = require('../settings.js');
const COLLECTION_NAME = 'discussion';

async function getDiscussionById(discussionId) {
    return await db.collection(COLLECTION_NAME)
        .doc(discussionId)
        .get();
}

module.exports = {
    getDiscussionById,
};
