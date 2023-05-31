import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { LoadingState, PayloadWithOptionalCallback } from "@/shared/interfaces";
import {
  ChatMessageUserStatus,
  CommonFeedObjectUserUnique,
  Discussion,
  DiscussionMessage,
  Governance,
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

export const getGovernanceStateByCommonId = createAsyncAction(
  CacheActionType.GET_GOVERNANCE_STATE_BY_COMMON_ID,
  CacheActionType.GET_GOVERNANCE_STATE_BY_COMMON_ID_SUCCESS,
  CacheActionType.GET_GOVERNANCE_STATE_BY_COMMON_ID_FAILURE,
)<
  PayloadWithOptionalCallback<
    { commonId: string; force?: boolean },
    Governance | null,
    Error
  >,
  Governance | null,
  Error
>();

export const updateGovernanceStateByCommonId = createStandardAction(
  CacheActionType.UPDATE_GOVERNANCE_STATE_BY_COMMON_ID,
)<{
  commonId: string;
  state: LoadingState<Governance | null>;
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

export const addDiscussionMessageByDiscussionId = createStandardAction(
  CacheActionType.ADD_DISCUSSION_MESSAGE_BY_DISCUSSION_ID,
)<{
  discussionId: string;
  discussionMessage: DiscussionMessage;
}>();

export const updateDiscussionMessageWithActualId = createStandardAction(
  CacheActionType.UPDATE_DISCUSSION_STATE_BY_DISCUSSION_MESSAGES_ACTUAL_ID,
)<{
  discussionId: string;
  pendingMessageId: string;
  actualId: string;
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

export const getChatMessageUserStatus = createAsyncAction(
  CacheActionType.GET_CHAT_MESSAGE_USER_STATUS,
  CacheActionType.GET_CHAT_MESSAGE_USER_STATUS_SUCCESS,
  CacheActionType.GET_CHAT_MESSAGE_USER_STATUS_FAILURE,
)<
  PayloadWithOptionalCallback<
    {
      userId: string;
      chatChannelId: string;
    },
    ChatMessageUserStatus | null,
    Error
  >,
  ChatMessageUserStatus | null,
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

export const updateChatMessageUserStatus = createStandardAction(
  CacheActionType.UPDATE_CHAT_MESSAGE_USER_STATUS,
)<{
  userId: string;
  chatChannelId: string;
  state: LoadingState<ChatMessageUserStatus | null>;
}>();
