const functions = require('firebase-functions');
const backupUtil = require('../util/backup');

exports.backup = functions.pubsub
  .schedule('0 */3 * * *')
  .onRun(async () => {
    console.time('Backup');
    console.info('🚀 Beginning backup procedure');

    await backupUtil.backup();

    console.info('✨ Backup procedure done successfully');
    console.timeEnd('Backup');
  });