import * as functions from 'firebase-functions';

import { backup } from '../util/backup';

export const backupCron = functions.pubsub
  .schedule('0 */3 * * *')
  .onRun(async () => {
    logger.info('🚀 Beginning backup procedure');

    await backup();

    logger.info('✨ Backup procedure done successfully');
  });
