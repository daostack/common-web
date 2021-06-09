import { updateAllTimeStatistics } from './commands/updateAllTimeStatistics';
import { forceUpdateAllTimeStatistics } from './commands/forceUpdateAllTimeStatistics';

export const statisticService = {
  updateAllTime: updateAllTimeStatistics,

  _forceUpdateAllTime: forceUpdateAllTimeStatistics
};