import * as functions from 'firebase-functions';

import backupUtil from '../util/backup';

export const backup = functions.pubsub
  .schedule('0 */3 * * *')
  .onRun(async () => {
    logger.info('🚀 Beginning backup procedure');

    await backupUtil.backup();

    logger.info('✨ Backup procedure done successfully');
  });
