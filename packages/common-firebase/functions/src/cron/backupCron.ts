import * as functions from 'firebase-functions';

import backupUtil from '../util/backup';

export const backup = functions.pubsub
  .schedule('0 */3 * * *')
  .onRun(async () => {
    console.time('Backup');
    console.info('🚀 Beginning backup procedure');

    await backupUtil.backup();

    console.info('✨ Backup procedure done successfully');
    console.timeEnd('Backup');
  });
