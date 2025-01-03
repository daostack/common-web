import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import {
  Common,
  CommonFeed,
  OptimisticFeedItemState
} from "@/shared/models";
import { createStandardAction } from "typesafe-actions";
import { OptimisticActionType } from "./constants";

export const setOptimisticFeedItem = createStandardAction(
  OptimisticActionType.SET_OPTIMISTIC_FEED_ITEM,
)<{
  data: CommonFeed;
  common: Common;
}>();

export const updateOptimisticFeedItemState = createStandardAction(
  OptimisticActionType.UPDATE_OPTIMISTIC_FEED_ITEM,
)<{
  id: string;
  state: OptimisticFeedItemState;
}>();

export const removeOptimisticFeedItemState = createStandardAction(
  OptimisticActionType.REMOVE_OPTIMISTIC_FEED_ITEM,
)<{
  id: string;
}>();

export const removeOptimisticInboxFeedItemState = createStandardAction(
  OptimisticActionType.REMOVE_OPTIMISTIC_INBOX_FEED_ITEM,
)<{
  id: string;
}>();

export const setOptimisticDiscussionMessages = createStandardAction(
  OptimisticActionType.SET_OPTIMISTIC_DISCUSSION_MESSAGES,
)<CreateDiscussionMessageDto>();

export const clearOptimisticDiscussionMessages = createStandardAction(
  OptimisticActionType.CLEAR_OPTIMISTIC_DISCUSSION_MESSAGES,
)<string>();

export const setInstantDiscussionMessagesOrder = createStandardAction(
  OptimisticActionType.SET_INSTANT_DISCUSSION_MESSAGES_ORDER,
)<{
  discussionId: string;
}>();

export const clearInstantDiscussionMessagesOrder = createStandardAction(
  OptimisticActionType.CLEAR_INSTANT_DISCUSSION_MESSAGES_ORDER,
)();

export const clearCreatedOptimisticFeedItem = createStandardAction(
  OptimisticActionType.CLEAR_CREATED_OPTIMISTIC_FEED_ITEM,
)<string>();

export const resetOptimisticState = createStandardAction(
  OptimisticActionType.RESET_OPTIMISTIC_STATE,
)();