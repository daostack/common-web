import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { LoadingState, PayloadWithOptionalCallback } from "@/shared/interfaces";
import {
  ChatChannelUserStatus,
  CirclesPermissions,
  CommonFeedObjectUserUnique,
  CommonMember,
  Discussion,
  DiscussionMessage,
  DiscussionMessageWithParsedText,
  Governance,
  Proposal,
  User,
  ChatMessage,
} from "@/shared/models";
import { CacheActionType } from "./constants";
import { FeedState } from "./types";

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

export const updateUserStates = createStandardAction(
  CacheActionType.UPDATE_USER_STATES,
)<Array<User>>();

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

export const updateDiscussionStates = createStandardAction(
  CacheActionType.UPDATE_DISCUSSION_STATES,
)<Array<Discussion | null>>();

export const updateDiscussionMessageWithActualId = createStandardAction(
  CacheActionType.UPDATE_DISCUSSION_STATE_BY_DISCUSSION_MESSAGES_ACTUAL_ID,
)<{
  discussionId: string;
  pendingMessageId: string;
  actualId: string;
}>();

export const updateDiscussionMessagesStateByDiscussionId = createStandardAction(
  CacheActionType.UPDATE_DISCUSSION_STATE_BY_DISCUSSION_ID,
)<{
  discussionId: string;
  updatedDiscussionMessages: DiscussionMessageWithParsedText[];
  removedDiscussionMessages: DiscussionMessage[];
}>();

export const resetDiscussionMessagesStates = createStandardAction(
  CacheActionType.RESET_DISCUSSION_MESSAGES_STATES,
)();

export const addDiscussionMessageByDiscussionId = createStandardAction(
  CacheActionType.ADD_DISCUSSION_MESSAGE_BY_DISCUSSION_ID,
)<{
  discussionId: string;
  discussionMessage: DiscussionMessageWithParsedText;
}>();

export const deleteDiscussionMessageById = createStandardAction(
  CacheActionType.DELETE_DISCUSSION_MESSAGE_BY_ID,
)<{
  discussionId: string;
  discussionMessageId: string;
}>();

export const setChatChannelMessagesStateByChatChannelId = createStandardAction(
  CacheActionType.SET_CHAT_CHANNEL_MESSAGES_STATE_BY_CHAT_CHANNEL_ID,
)<{
  chatChannelId: string;
  chatChannelMessages: ChatMessage[];
}>();

export const addChatChannelMessageByChatChannelId = createStandardAction(
  CacheActionType.ADD_CHAT_CHANNEL_MESSAGE_BY_CHAT_CHANNEL_ID,
)<{
  chatChannelId: string;
  chatChannelMessage: ChatMessage;
}>();

export const updateChatChannelMessages = createStandardAction(
  CacheActionType.UPDATE_CHAT_CHANNEL_MESSAGES,
)<{
  chatChannelId: string;
  updatedChatChannelMessages?: ChatMessage[];
  removedChatChannelMessageIds?: string[];
}>();

export const resetChatChannelMessagesStates = createStandardAction(
  CacheActionType.RESET_CHAT_CHANNEL_MESSAGES_STATES,
)();

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

export const updateProposalStates = createStandardAction(
  CacheActionType.UPDATE_PROPOSAL_STATES,
)<Array<Proposal | null>>();

export const updateProposalStateById = createStandardAction(
  CacheActionType.UPDATE_PROPOSAL_STATE_BY_ID,
)<{
  proposalId: string;
  state: LoadingState<Proposal | null>;
}>();

export const copyFeedStateByCommonId = createStandardAction(
  CacheActionType.COPY_FEED_STATE_BY_COMMON_ID,
)<string>();

export const updateFeedStateByCommonId = createStandardAction(
  CacheActionType.UPDATE_FEED_STATE_BY_COMMON_ID,
)<{
  commonId: string;
  state: FeedState;
}>();

export const clearFeedStateByCommonId = createStandardAction(
  CacheActionType.CLEAR_FEED_STATE_BY_COMMON_ID,
)<string>();

export const resetFeedStates = createStandardAction(
  CacheActionType.RESET_FEED_STATES,
)();

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

export const getChatChannelUserStatus = createAsyncAction(
  CacheActionType.GET_CHAT_CHANNEL_USER_STATUS,
  CacheActionType.GET_CHAT_CHANNEL_USER_STATUS_SUCCESS,
  CacheActionType.GET_CHAT_CHANNEL_USER_STATUS_FAILURE,
)<
  PayloadWithOptionalCallback<
    {
      userId: string;
      chatChannelId: string;
    },
    ChatChannelUserStatus | null,
    Error
  >,
  ChatChannelUserStatus | null,
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

export const updateFeedItemUserSeenState = createStandardAction(
  CacheActionType.UPDATE_FEED_ITEM_USER_SEEN_STATE,
)<{
  key: string;
  seen: boolean;
  isSeenUpdating: boolean;
}>();

export const updateChatChannelUserStatus = createStandardAction(
  CacheActionType.UPDATE_CHAT_CHANNEL_USER_STATUS,
)<{
  userId: string;
  chatChannelId: string;
  state: LoadingState<ChatChannelUserStatus | null>;
}>();

export const updateChatChannelUserSeenState = createStandardAction(
  CacheActionType.UPDATE_CHAT_CHANNEL_USER_SEEN_STATE,
)<{
  key: string;
  seen: boolean;
  isSeenUpdating: boolean;
}>();

export const updateCommonMembersByCommonId = createStandardAction(
  CacheActionType.UPDATE_COMMON_MEMBERS_BY_COMMON_ID,
)<{
  commonId?: string;
  commonMembers: CommonMember[];
}>();

export const addUserToExternalCommonUsers = createStandardAction(
  CacheActionType.ADD_USER_TO_EXTERNAL_COMMON_USERS,
)<{
  user: User;
}>();

export const updateCommonMemberStateByUserAndCommonIds = createStandardAction(
  CacheActionType.UPDATE_COMMON_MEMBER_STATE_BY_USER_AND_COMMON_ID,
)<{
  userId: string;
  commonId: string;
  state: LoadingState<(CommonMember & CirclesPermissions) | null>;
}>();

export const updateDiscussionMessageReactions = createStandardAction(
  CacheActionType.UPDATE_DISCUSSION_MESSAGE_REACTIONS,
)<{
  discussionId?: string;
  discussionMessageId: string;
  emoji: string;
  prevUserEmoji?: string;
}>();
