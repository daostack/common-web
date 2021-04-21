import { canChangeDiscussionSubscription } from './discussions/canChangeDiscussionSubscription';
import { canSeeCommonReports } from './reports/canSeeCommonReports';
import { canSeeMessageReports } from './reports/canSeeMessageReports';
import { canActOnReport } from './reports/canActOnReport';

export const authorizationService = {
  discussions: {
    canChangeSubscription: canChangeDiscussionSubscription
  },
  reports: {
    canActOnReport: canActOnReport,
    canSeeCommonReports: canSeeCommonReports,
    canSeeMessageReports: canSeeMessageReports
  }
};