import { canChangeDiscussionSubscription } from './discussions/canChangeDiscussionSubscription';
import { canSeeCommonReports } from './reports/canSeeCommonReports';
import { canSeeMessageReports } from './reports/canSeeMessageReports';
import { canActOnReport } from './reports/canActOnReport';

import { userCan } from './userCan';
import { canUpdateCommon } from './common/canUpdateCommon';

export const authorizationService = {
  discussions: {
    canChangeSubscription: canChangeDiscussionSubscription
  },
  reports: {
    canActOnReport: canActOnReport,
    canSeeCommonReports: canSeeCommonReports,
    canSeeMessageReports: canSeeMessageReports
  },
  common: {
    canUpdate: canUpdateCommon
  },

  can: userCan
};