import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { LoadingState, PayloadWithOptionalCallback } from "@/shared/interfaces";
import {
  CommonFeedObjectUserUnique,
  Discussion,
  DiscussionMessage,
  Proposal,
  User,
} from "@/shared/models";
import { CacheActionType } from "./constants";

export const getUserStateById = createAsyncAction(
  CacheActionType.GET_USER_STATE_BY_ID,
  CacheActionType.GET_USER_STATE_BY_ID_SUCCESS,
  CacheActionType.GET_USER_STATE_BY_ID_FAILURE,
)<
  PayloadWithOptionalCallback<
    { userId: string; force?: boolean },
    User | null,
    Error
  >,
  User | null,
  Error
>();

export const updateUserStateById = createStandardAction(
  CacheActionType.UPDATE_USER_STATE_BY_ID,
)<{
  userId: string;
  state: LoadingState<User | null>;
}>();

export const getDiscussionStateById = createAsyncAction(
  CacheActionType.GET_DISCUSSION_STATE_BY_ID,
  CacheActionType.GET_DISCUSSION_STATE_BY_ID_SUCCESS,
  CacheActionType.GET_DISCUSSION_STATE_BY_ID_FAILURE,
)<
  PayloadWithOptionalCallback<
    { discussionId: string; force?: boolean },
    Discussion | null,
    Error
  >,
  Discussion | null,
  Error
>();

export const getDiscussionMessageStateByDiscussionId = createAsyncAction(
  CacheActionType.GET_DISCUSSION_MESSAGE_STATE_BY_DISCUSSION_ID,
  CacheActionType.GET_DISCUSSION_MESSAGE_STATE_BY_ID_DISCUSSION_SUCCESS,
  CacheActionType.GET_DISCUSSION_MESSAGE_STATE_BY_ID_DISCUSSION_FAILURE,
)<
  PayloadWithOptionalCallback<
    { discussionId: string; force?: boolean },
    DiscussionMessage[] | null,
    Error
  >,
  DiscussionMessage[] | null,
  Error
>();

export const updateDiscussionStateById = createStandardAction(
  CacheActionType.UPDATE_DISCUSSION_STATE_BY_ID,
)<{
  discussionId: string;
  state: LoadingState<Discussion | null>;
}>();

export const updateDiscussionMessagesStateByDiscussionId = createStandardAction(
  CacheActionType.UPDATE_DISCUSSION_STATE_BY_DISCUSSION_ID,
)<{
  discussionId: string;
  state: LoadingState<DiscussionMessage[] | null>;
}>();

export const getProposalStateById = createAsyncAction(
  CacheActionType.GET_PROPOSAL_STATE_BY_ID,
  CacheActionType.GET_PROPOSAL_STATE_BY_ID_SUCCESS,
  CacheActionType.GET_PROPOSAL_STATE_BY_ID_FAILURE,
)<
  PayloadWithOptionalCallback<
    { proposalId: string; force?: boolean },
    Proposal | null,
    Error
  >,
  Proposal | null,
  Error
>();

export const updateProposalStateById = createStandardAction(
  CacheActionType.UPDATE_PROPOSAL_STATE_BY_ID,
)<{
  proposalId: string;
  state: LoadingState<Proposal | null>;
}>();

export const getFeedItemUserMetadata = createAsyncAction(
  CacheActionType.GET_FEED_ITEM_USER_METADATA,
  CacheActionType.GET_FEED_ITEM_USER_METADATA_SUCCESS,
  CacheActionType.GET_FEED_ITEM_USER_METADATA_FAILURE,
)<
  PayloadWithOptionalCallback<
    {
      commonId: string;
      userId: string;
      feedObjectId: string;
    },
    CommonFeedObjectUserUnique | null,
    Error
  >,
  CommonFeedObjectUserUnique | null,
  Error
>();

export const updateFeedItemUserMetadata = createStandardAction(
  CacheActionType.UPDATE_FEED_ITEM_USER_METADATA,
)<{
  commonId: string;
  userId: string;
  feedObjectId: string;
  state: LoadingState<CommonFeedObjectUserUnique | null>;
}>();
