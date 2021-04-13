import { canChangeDiscussionSubscription } from './discussions/canChangeDiscussionSubscription';

export const authorizationService = {
  discussions: {
    canChangeSubscription: canChangeDiscussionSubscription
  }
};