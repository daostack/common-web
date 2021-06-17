import { updateAllTimeStatistics } from './commands/updateAllTimeStatistics';
import { forceUpdateAllTimeStatistics } from './commands/forceUpdateAllTimeStatistics';
import { createEmptyStatistic } from './commands/createEmptyStatistic';
import { updateCurrentStatistics } from './commands/updateCurrentStatistics';
import { updateStatistics } from './commands/updateStatistics';

export const statisticService = {
  updateAllTime: updateAllTimeStatistics,

  create: createEmptyStatistic,
  updateAll: updateStatistics,
  updateCurrent: updateCurrentStatistics,

  _forceUpdateAllTime: forceUpdateAllTimeStatistics
};