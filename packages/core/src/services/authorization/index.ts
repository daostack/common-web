import { canChangeDiscussionSubscription } from './discussions/canChangeDiscussionSubscription';
import { canSeeCommonReports } from './reports/canSeeCommonReports';
import { canSeeMessageReports } from './reports/canSeeMessageReports';

export const authorizationService = {
  discussions: {
    canChangeSubscription: canChangeDiscussionSubscription
  },
  reports: {
    canSeeCommonReports: canSeeCommonReports,
    canSeeMessageReports: canSeeMessageReports
  }
};