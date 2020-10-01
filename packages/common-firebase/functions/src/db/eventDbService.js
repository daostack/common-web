
const admin = require('firebase-admin');
const db = admin.firestore();

const COLLECTION_NAME = 'event';

async function createEvent(doc) {
    return await db.collection(COLLECTION_NAME).add(doc);
}

module.exports = {
    createEvent
};
