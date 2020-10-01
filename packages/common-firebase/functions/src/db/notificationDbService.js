
const admin = require('firebase-admin');
const db = admin.firestore();

const COLLECTION_NAME = 'notification';

async function createNotification(doc) {
    return await db.collection(COLLECTION_NAME).add(doc);
}

module.exports = {
    createNotification
};
