export enum CacheActionType {
  GET_USER_STATE_BY_ID = "@CACHE/GET_USER_STATE_BY_ID",
  GET_USER_STATE_BY_ID_SUCCESS = "@CACHE/GET_USER_STATE_BY_ID_SUCCESS",
  GET_USER_STATE_BY_ID_FAILURE = "@CACHE/GET_USER_STATE_BY_ID_FAILURE",

  UPDATE_USER_STATES = "@CACHE/UPDATE_USER_STATES",
  UPDATE_USER_STATE_BY_ID = "@CACHE/UPDATE_USER_STATE_BY_ID",

  GET_GOVERNANCE_STATE_BY_COMMON_ID = "@CACHE/GET_GOVERNANCE_STATE_BY_COMMON_ID",
  GET_GOVERNANCE_STATE_BY_COMMON_ID_SUCCESS = "@CACHE/GET_GOVERNANCE_STATE_BY_COMMON_ID_SUCCESS",
  GET_GOVERNANCE_STATE_BY_COMMON_ID_FAILURE = "@CACHE/GET_GOVERNANCE_STATE_BY_COMMON_ID_FAILURE",

  UPDATE_GOVERNANCE_STATE_BY_COMMON_ID = "@CACHE/UPDATE_GOVERNANCE_STATE_BY_COMMON_ID",

  GET_DISCUSSION_STATE_BY_ID = "@CACHE/GET_DISCUSSION_STATE_BY_ID",
  GET_DISCUSSION_STATE_BY_ID_SUCCESS = "@CACHE/GET_DISCUSSION_STATE_BY_ID_SUCCESS",
  GET_DISCUSSION_STATE_BY_ID_FAILURE = "@CACHE/GET_DISCUSSION_STATE_BY_ID_FAILURE",

  GET_DISCUSSION_MESSAGE_STATE_BY_DISCUSSION_ID = "@CACHE/GET_DISCUSSION_MESSAGE_STATE_BY_DISCUSSION_ID",
  GET_DISCUSSION_MESSAGE_STATE_BY_ID_DISCUSSION_SUCCESS = "@CACHE/GET_DISCUSSION_MESSAGE_STATE_BY_ID_DISCUSSION_SUCCESS",
  GET_DISCUSSION_MESSAGE_STATE_BY_ID_DISCUSSION_FAILURE = "@CACHE/GET_DISCUSSION_MESSAGE_STATE_BY_ID_DISCUSSION_FAILURE",

  UPDATE_DISCUSSION_STATE_BY_ID = "@CACHE/UPDATE_DISCUSSION_STATE_BY_ID",
  UPDATE_DISCUSSION_STATES = "@CACHE/UPDATE_DISCUSSION_STATES",
  UPDATE_DISCUSSION_STATE_BY_DISCUSSION_ID = "@CACHE/UPDATE_DISCUSSION_STATE_BY_DISCUSSION_ID",
  ADD_DISCUSSION_MESSAGE_BY_DISCUSSION_ID = "@CACHE/ADD_DISCUSSION_MESSAGE_BY_DISCUSSION_ID",
  DELETE_DISCUSSION_MESSAGE_BY_ID = "@CACHE/DELETE_DISCUSSION_MESSAGE_BY_ID",
  UPDATE_DISCUSSION_STATE_BY_DISCUSSION_MESSAGES_ACTUAL_ID = "@CACHE/UPDATE_DISCUSSION_STATE_BY_DISCUSSION_MESSAGES_ACTUAL_ID",
  GET_PROPOSAL_STATE_BY_ID = "@CACHE/GET_PROPOSAL_STATE_BY_ID",
  GET_PROPOSAL_STATE_BY_ID_SUCCESS = "@CACHE/GET_PROPOSAL_STATE_BY_ID_SUCCESS",
  GET_PROPOSAL_STATE_BY_ID_FAILURE = "@CACHE/GET_PROPOSAL_STATE_BY_ID_FAILURE",

  UPDATE_PROPOSAL_STATES = "@CACHE/UPDATE_PROPOSAL_STATES",
  UPDATE_PROPOSAL_STATE_BY_ID = "@CACHE/UPDATE_PROPOSAL_STATE_BY_ID",

  COPY_FEED_STATE_BY_COMMON_ID = "@CACHE/COPY_FEED_STATE_BY_COMMON_ID",
  UPDATE_FEED_STATE_BY_COMMON_ID = "@CACHE/UPDATE_FEED_STATE_BY_COMMON_ID",
  RESET_FEED_STATES = "@CACHE/RESET_FEED_STATES",

  GET_FEED_ITEM_USER_METADATA = "@CACHE/GET_FEED_ITEM_USER_METADATA",
  GET_FEED_ITEM_USER_METADATA_SUCCESS = "@CACHE/GET_FEED_ITEM_USER_METADATA_SUCCESS",
  GET_FEED_ITEM_USER_METADATA_FAILURE = "@CACHE/GET_FEED_ITEM_USER_METADATA_FAILURE",

  UPDATE_FEED_ITEM_USER_METADATA = "@CACHE/UPDATE_FEED_ITEM_USER_METADATA",

  GET_CHAT_CHANNEL_USER_STATUS = "@CACHE/GET_CHAT_CHANNEL_USER_STATUS",
  GET_CHAT_CHANNEL_USER_STATUS_SUCCESS = "@CACHE/GET_CHAT_CHANNEL_USER_STATUS_SUCCESS",
  GET_CHAT_CHANNEL_USER_STATUS_FAILURE = "@CACHE/GET_CHAT_CHANNEL_USER_STATUS_FAILURE",

  UPDATE_CHAT_CHANNEL_USER_STATUS = "@CACHE/UPDATE_CHAT_CHANNEL_USER_STATUS",

  UPDATE_COMMON_MEMBERS_BY_COMMON_ID = "@CACHE/UPDATE_COMMON_MEMBERS_BY_COMMON_ID",
  SET_STATE_COMMON_MEMBERS_BY_COMMON_ID = "@CACHE/SET_STATE_COMMON_MEMBERS_BY_COMMON_ID",

  UPDATE_COMMON_MEMBER_STATE_BY_USER_AND_COMMON_ID = "@CACHE/UPDATE_COMMON_MEMBER_STATE_BY_USER_AND_COMMON_ID",
}
