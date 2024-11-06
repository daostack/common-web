import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import {
  CommonFeed,
  OptimisticFeedItemState
} from "@/shared/models";
import { createStandardAction } from "typesafe-actions";
import { OptimisticActionType } from "./constants";

export const setOptimisticFeedItem = createStandardAction(
  OptimisticActionType.SET_OPTIMISTIC_FEED_ITEM,
)<CommonFeed>();

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

export const clearCreatedOptimisticFeedItem = createStandardAction(
  OptimisticActionType.CLEAR_CREATED_OPTIMISTIC_FEED_ITEM,
)<string>();