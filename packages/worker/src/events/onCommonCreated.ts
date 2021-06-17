import { statisticService, logger } from '@common/core';
import { EventHookHandler } from './index';

export const onCommonCreated: EventHookHandler = async (data, event) => {
  if (event.type === 'CommonCreated') {
    logger.info('Executing `onCommonCreated`');

    // Update the statistics
    await statisticService.updateAll({
      commons: {
        increment: 1
      }
    });
  }
};