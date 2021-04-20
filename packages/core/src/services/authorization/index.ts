import { canChangeDiscussionSubscription } from './discussions/canChangeDiscussionSubscription';
import { canSeeCommonReports } from './reports/canSeeCommonReports';

export const authorizationService = {
  discussions: {
    canChangeSubscription: canChangeDiscussionSubscription
  },
  reports: {
    canSeeCommonReports: canSeeCommonReports
  }
};