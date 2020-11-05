const {Collections} = require('../constants');

// @ts-ignore
const {db} = require('../settings');
const {env} = require('../constants');


async function updateDao(daoId, doc) {
  return await db.collection(Collections.Commons)
    .doc(daoId).set(
      doc,
      {
        merge: true
      }
    );
}

async function getDaoById(daoId) {
  return await db.collection(Collections.Commons)
    .doc(daoId)
    .get();
}


module.exports = {
  updateDao,
  getDaoById
};
