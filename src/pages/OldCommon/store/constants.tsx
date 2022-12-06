export enum CommonsActionTypes {
  CREATE_GOVERNANCE = "@COMMONS/CREATE_GOVERNANCE",
  CREATE_GOVERNANCE_SUCCESS = "@COMMONS/CREATE_GOVERNANCE_SUCCESS",
  CREATE_GOVERNANCE_FAILURE = "@COMMONS/CREATE_GOVERNANCE_FAILURE",

  GET_COMMONS_LIST = "@COMMONS/GET_COMMONS_LIST",
  GET_COMMONS_LIST_SUCCESS = "@COMMONS/GET_COMMONS_LIST_SUCCESS",
  GET_COMMONS_LIST_FAILURE = "@COMMONS/GET_COMMONS_LIST_FAILURE",

  GET_COMMONS_LIST_BY_IDS = "@COMMONS/GET_COMMONS_LIST_BY_IDS",
  GET_COMMONS_LIST_BY_IDS_SUCCESS = "@COMMONS/GET_COMMONS_LIST_BY_IDS_SUCCESS",
  GET_COMMONS_LIST_BY_IDS_FAILURE = "@COMMONS/GET_COMMONS_LIST_BY_IDS_FAILURE",

  GET_COMMON_DETAIL = "@COMMONS/GET_COMMON_DETAIL",
  GET_COMMON_DETAIL_SUCCESS = "@COMMONS/GET_COMMON_DETAIL_SUCCESS",
  GET_COMMON_DETAIL_FAILURE = "@COMMONS/GET_COMMON_DETAIL_FAILURE",

  UPDATE_PAGE = "@COMMONS/UPDATE_PAGE",

  SET_DISCUSSION = "@COMMONS/SET_DISCUSSIONS",

  SET_PROPOSALS = "@COMMONS/SET_PROPOSALS",

  SET_ACTIVE_TAB = "@COMMONS/SET_ACTIVE_TAB",

  LOAD_COMMON_DISCUSSIONS = "@COMMONS/LOAD_COMMON_DISCUSSIONS",
  LOAD_COMMON_DISCUSSIONS_SUCCESS = "@COMMONS/LOAD_COMMON_DISCUSSIONS_SUCCESS",
  LOAD_COMMON_DISCUSSIONS_FAILURE = "@COMMONS/LOAD_COMMON_DISCUSSIONS_FAILURE",

  HIDE_COMMON_DISCUSSION = "@COMMONS/HIDE_COMMON_DISCUSSION",
  HIDE_COMMON_DISCUSSION_SUCCESS = "@COMMONS/HIDE_COMMON_DISCUSSION_SUCCESS",
  HIDE_COMMON_DISCUSSION_FAILURE = "@COMMONS/HIDE_COMMON_DISCUSSION_FAILURE",

  LOAD_DISCUSSION_DETAIL = "@COMMONS/LOAD_DISCUSSION_DETAIL",
  LOAD_DISCUSSION_DETAIL_SUCCESS = "@COMMONS/LOAD_DISCUSSION_DETAIL_SUCCESS",
  LOAD_DISCUSSION_DETAIL_FAILURE = "@COMMONS/LOAD_DISCUSSION_DETAIL_FAILURE",

  CLEAR_CURRENT_DISCUSSION = "@COMMONS/CLEAR_CURRENT_DISCUSSION",

  UPDATE_CURRENT_PROPOSAL = "@COMMONS/UPDATE_CURRENT_PROPOSAL",

  CLEAR_CURRENT_PROPOSAL = "@COMMONS/CLEAR_CURRENT_PROPOSAL",

  CLEAR_ACTIVE_TAB = "@COMMONS/CLEAR_ACTIVE_TAB",

  CLOSE_CURRENT_COMMON = "@COMMONS/CLOSE_CURRENT_COMMON",

  LOAD_PROPOSAL_LIST = "@COMMONS/LOAD_PROPOSAL_LIST",
  LOAD_PROPOSAL_LIST_SUCCESS = "@COMMONS/LOAD_PROPOSAL_LIST_SUCCESS",
  LOAD_PROPOSAL_LIST_FAILURE = "@COMMONS/LOAD_PROPOSAL_LIST_FAILURE",

  HIDE_COMMON_PROPOSAL = "@COMMONS/HIDE_COMMON_PROPOSAL",
  HIDE_COMMON_PROPOSAL_SUCCESS = "@COMMONS/HIDE_COMMON_PROPOSAL_SUCCESS",
  HIDE_COMMON_PROPOSAL_FAILURE = "@COMMONS/HIDE_COMMON_PROPOSAL_FAILURE",

  LOAD_PROPOSAL_DETAIL = "@COMMONS/LOAD_PROPOSAL_DETAIL",
  LOAD_PROPOSAL_DETAIL_SUCCESS = "@COMMONS/LOAD_PROPOSAL_DETAIL_SUCCESS",
  LOAD_PROPOSAL_DETAIL_FAILURE = "@COMMONS/LOAD_PROPOSAL_DETAIL_FAILURE",

  LOAD_USER_PROPOSAL_LIST = "@COMMONS/LOAD_USER_PROPOSAL_LIST",
  LOAD_USER_PROPOSAL_LIST_SUCCESS = "@COMMONS/LOAD_USER_PROPOSAL_LIST_SUCCESS",
  LOAD_USER_PROPOSAL_LIST_FAILURE = "@COMMONS/LOAD_USER_PROPOSAL_LIST_FAILURE",

  CREATE_DISCUSSION = "@@COMMONS/CREATE_DISCUSSION",
  CREATE_DISCUSSION_SUCCESS = "@@COMMONS/CREATE_DISCUSSION_SUCCESS",
  CREATE_DISCUSSION_FAILURE = "@@COMMONS/CREATE_DISCUSSION_FAILURE",

  ADD_MESSAGE_TO_DISCUSSION = "@@COMMONS/ADD_MESSAGE_TO_DISCUSSION",
  ADD_MESSAGE_TO_DISCUSSION_SUCCESS = "@@COMMONS/ADD_MESSAGE_TO_DISCUSSION_SUCCESS",
  ADD_MESSAGE_TO_DISCUSSION_FAILURE = "@@COMMONS/ADD_MESSAGE_TO_DISCUSSION_FAILURE",

  CREATE_MEMBER_ADMITTANCE_PROPOSAL = "@COMMONS/CREATE_MEMBER_ADMITTANCE_PROPOSAL",
  CREATE_MEMBER_ADMITTANCE_PROPOSAL_SUCCESS = "@COMMONS/CREATE_MEMBER_ADMITTANCE_PROPOSAL_SUCCESS",
  CREATE_MEMBER_ADMITTANCE_PROPOSAL_FAILURE = "@COMMONS/CREATE_MEMBER_ADMITTANCE_PROPOSAL_FAILURE",

  CREATE_ASSIGN_CIRCLE_PROPOSAL = "@COMMONS/CREATE_ASSIGN_CIRCLE_PROPOSAL",
  CREATE_ASSIGN_CIRCLE_PROPOSAL_SUCCESS = "@COMMONS/CREATE_ASSIGN_CIRCLE_PROPOSAL_SUCCESS",
  CREATE_ASSIGN_CIRCLE_PROPOSAL_FAILURE = "@COMMONS/CREATE_ASSIGN_CIRCLE_PROPOSAL_FAILURE",

  CREATE_REMOVE_CIRCLE_PROPOSAL = "@COMMONS/CREATE_REMOVE_CIRCLE_PROPOSAL",
  CREATE_REMOVE_CIRCLE_PROPOSAL_SUCCESS = "@COMMONS/CREATE_REMOVE_CIRCLE_PROPOSAL_SUCCESS",
  CREATE_REMOVE_CIRCLE_PROPOSAL_FAILURE = "@COMMONS/CREATE_REMOVE_CIRCLE_PROPOSAL_FAILURE",

  CREATE_FUNDING_PROPOSAL = "@COMMONS/CREATE_FUNDING_PROPOSAL",
  CREATE_FUNDING_PROPOSAL_SUCCESS = "@COMMONS/CREATE_FUNDING_PROPOSAL_SUCCESS",
  CREATE_FUNDING_PROPOSAL_FAILURE = "@COMMONS/CREATE_FUNDING_PROPOSAL_FAILURE",

  CREATE_SURVEY = "@COMMONS/CREATE_SURVEY",
  CREATE_SURVEY_SUCCESS = "@COMMONS/CREATE_SURVEY_SUCCESS",
  CREATE_SURVEY_FAILURE = "@COMMONS/CREATE_SURVEY_FAILURE",

  CREATE_DELETE_COMMON_PROPOSAL = "@COMMONS/CREATE_DELETE_COMMON_PROPOSAL",
  CREATE_DELETE_COMMON_PROPOSAL_SUCCESS = "@COMMONS/CREATE_DELETE_COMMON_PROPOSAL_SUCCESS",
  CREATE_DELETE_COMMON_PROPOSAL_FAILURE = "@COMMONS/CREATE_DELETE_COMMON_PROPOSAL_FAILURE",

  LOAD_USER_CARDS = "@COMMONS/LOAD_USER_CARDS",
  LOAD_USER_CARDS_SUCCESS = "@COMMONS/LOAD_USER_CARDS_SUCCESS",
  LOAD_USER_CARDS_FAILURE = "@COMMONS/LOAD_USER_CARDS_FAILURE",

  ADD_MESSAGE_TO_PROPOSAL = "@@COMMONS/ADD_MESSAGE_TO_PROPOSAL",
  ADD_MESSAGE_TO_PROPOSAL_SUCCESS = "@@COMMONS/ADD_MESSAGE_TO_PROPOSAL_SUCCESS",
  ADD_MESSAGE_TO_PROPOSAL_FAILURE = "@@COMMONS/ADD_MESSAGE_TO_PROPOSAL_FAILURE",

  LEAVE_COMMON = "@COMMONS/LEAVE_COMMON",
  LEAVE_COMMON_SUCCESS = "@COMMONS/LEAVE_COMMON_SUCCESS",
  LEAVE_COMMON_FAILURE = "@COMMONS/LEAVE_COMMON_FAILURE",

  DELETE_COMMON = "@COMMONS/DELETE_COMMON",
  DELETE_COMMON_SUCCESS = "@COMMONS/DELETE_COMMON_SUCCESS",
  DELETE_COMMON_FAILURE = "@COMMONS/DELETE_COMMON_FAILURE",

  CREATE_COMMON = "@COMMONS/CREATE_COMMON",
  CREATE_COMMON_SUCCESS = "@COMMONS/CREATE_COMMON_SUCCESS",
  CREATE_COMMON_FAILURE = "@COMMONS/CREATE_COMMON_FAILURE",

  UPDATE_COMMON = "@COMMONS/UPDATE_COMMON",
  UPDATE_COMMON_SUCCESS = "@COMMONS/UPDATE_COMMON_SUCCESS",
  UPDATE_COMMON_FAILURE = "@COMMONS/UPDATE_COMMON_FAILURE",

  CREATE_VOTE = "@COMMONS/CREATE_VOTE",
  CREATE_VOTE_SUCCESS = "@COMMONS/CREATE_VOTE_SUCCESS",
  CREATE_VOTE_FAILURE = "@COMMONS/CREATE_VOTE_FAILURE",

  UPDATE_VOTE = "@COMMONS/UPDATE_VOTE",
  UPDATE_VOTE_SUCCESS = "@COMMONS/UPDATE_VOTE_SUCCESS",
  UPDATE_VOTE_FAILURE = "@COMMONS/UPDATE_VOTE_FAILURE",

  MAKE_IMMEDIATE_CONTRIBUTION = "@COMMONS/MAKE_IMMEDIATE_CONTRIBUTION",
  MAKE_IMMEDIATE_CONTRIBUTION_SUCCESS = "@COMMONS/MAKE_IMMEDIATE_CONTRIBUTION_SUCCESS",
  MAKE_IMMEDIATE_CONTRIBUTION_FAILURE = "@COMMONS/MAKE_IMMEDIATE_CONTRIBUTION_FAILURE",

  CREATE_SUBSCRIPTION = "@COMMONS/CREATE_SUBSCRIPTION",
  CREATE_SUBSCRIPTION_SUCCESS = "@COMMONS/CREATE_SUBSCRIPTION_SUCCESS",
  CREATE_SUBSCRIPTION_FAILURE = "@COMMONS/CREATE_SUBSCRIPTION_FAILURE",

  CREATE_BUYER_TOKEN_PAGE = "@COMMONS/CREATE_BUYER_TOKEN_PAGE",
  CREATE_BUYER_TOKEN_PAGE_SUCCESS = "@COMMONS/CREATE_BUYER_TOKEN_PAGE_SUCCESS",
  CREATE_BUYER_TOKEN_PAGE_FAILURE = "@COMMONS/CREATE_BUYER_TOKEN_PAGE_FAILURE",

  ADD_BANK_DETAILS = "@COMMONS/ADD_BANK_DETAILS",
  ADD_BANK_DETAILS_SUCCESS = "@COMMONS/ADD_BANK_DETAILS_SUCCESS",
  ADD_BANK_DETAILS_FAILURE = "@COMMONS/ADD_BANK_DETAILS_FAILURE",

  UPDATE_BANK_DETAILS = "@COMMONS/UPDATE_BANK_DETAILS",
  UPDATE_BANK_DETAILS_SUCCESS = "@COMMONS/UPDATE_BANK_DETAILS_SUCCESS",
  UPDATE_BANK_DETAILS_FAILURE = "@COMMONS/UPDATE_BANK_DETAILS_FAILURE",

  DELETE_BANK_DETAILS = "@COMMONS/DELETE_BANK_DETAILS",
  DELETE_BANK_DETAILS_SUCCESS = "@COMMONS/DELETE_BANK_DETAILS_SUCCESS",
  DELETE_BANK_DETAILS_FAILURE = "@COMMONS/DELETE_BANK_DETAILS_FAILURE",

  GET_BANK_DETAILS = "@COMMONS/GET_BANK_DETAILS",
  GET_BANK_DETAILS_SUCCESS = "@COMMONS/GET_BANK_DETAILS_SUCCESS",
  GET_BANK_DETAILS_FAILURE = "@COMMONS/GET_BANK_DETAILS_FAILURE",

  GET_USER_CONTRIBUTIONS_TO_COMMON = "@COMMONS/GET_USER_CONTRIBUTIONS_TO_COMMON",
  GET_USER_CONTRIBUTIONS_TO_COMMON_SUCCESS = "@COMMONS/GET_USER_CONTRIBUTIONS_TO_COMMON_SUCCESS",
  GET_USER_CONTRIBUTIONS_TO_COMMON_FAILURE = "@COMMONS/GET_USER_CONTRIBUTIONS_TO_COMMON_FAILURE",

  GET_USER_CONTRIBUTIONS = "@COMMONS/GET_USER_CONTRIBUTIONS",
  GET_USER_CONTRIBUTIONS_SUCCESS = "@COMMONS/GET_USER_CONTRIBUTIONS_SUCCESS",
  GET_USER_CONTRIBUTIONS_FAILURE = "@COMMONS/GET_USER_CONTRIBUTIONS_FAILURE",

  GET_USER_SUBSCRIPTION_TO_COMMON = "@COMMONS/GET_USER_SUBSCRIPTION_TO_COMMON",
  GET_USER_SUBSCRIPTION_TO_COMMON_SUCCESS = "@COMMONS/GET_USER_SUBSCRIPTION_TO_COMMON_SUCCESS",
  GET_USER_SUBSCRIPTION_TO_COMMON_FAILURE = "@COMMONS/GET_USER_SUBSCRIPTION_TO_COMMON_FAILURE",

  GET_USER_SUBSCRIPTIONS = "@COMMONS/GET_USER_SUBSCRIPTIONS",
  GET_USER_SUBSCRIPTIONS_SUCCESS = "@COMMONS/GET_USER_SUBSCRIPTIONS_SUCCESS",
  GET_USER_SUBSCRIPTIONS_FAILURE = "@COMMONS/GET_USER_SUBSCRIPTIONS_FAILURE",

  UPDATE_SUBSCRIPTION = "@COMMONS/UPDATE_SUBSCRIPTION",
  UPDATE_SUBSCRIPTION_SUCCESS = "@COMMONS/UPDATE_SUBSCRIPTION_SUCCESS",
  UPDATE_SUBSCRIPTION_FAILURE = "@COMMONS/UPDATE_SUBSCRIPTION_FAILURE",

  CANCEL_SUBSCRIPTION = "@COMMONS/CANCEL_SUBSCRIPTION",
  CANCEL_SUBSCRIPTION_SUCCESS = "@COMMONS/CANCEL_SUBSCRIPTION_SUCCESS",
  CANCEL_SUBSCRIPTION_FAILURE = "@COMMONS/CANCEL_SUBSCRIPTION_FAILURE",

  GET_GOVERNANCE = "@COMMONS/GET_GOVERNANCE",
  GET_GOVERNANCE_SUCCESS = "@COMMONS/GET_GOVERNANCE_SUCCESS",
  GET_GOVERNANCE_FAILURE = "@COMMONS/GET_GOVERNANCE_FAILURE",

  GET_COMMON_MEMBER = "@COMMONS/GET_COMMON_MEMBER",
  GET_COMMON_MEMBER_SUCCESS = "@COMMONS/GET_COMMON_MEMBER_SUCCESS",
  GET_COMMON_MEMBER_FAILURE = "@COMMONS/GET_COMMON_MEMBER_FAILURE",

  GET_COMMON_MEMBERS = "@COMMONS/GET_COMMON_MEMBERS",
  GET_COMMON_MEMBERS_SUCCESS = "@COMMONS/GET_COMMON_MEMBERS_SUCCESS",
  GET_COMMON_MEMBERS_FAILURE = "@COMMONS/GET_COMMON_MEMBERS_FAILURE",

  GET_USER_COMMONS = "@COMMONS/GET_USER_COMMONS",
  GET_USER_COMMONS_SUCCESS = "@COMMONS/GET_USER_COMMONS_SUCCESS",
  GET_USER_COMMONS_FAILURE = "@COMMONS/GET_USER_COMMONS_FAILURE",

  DELETE_DISCUSSION_MESSAGE = "@COMMONS/DELETE_DISCUSSION_MESSAGE",
  DELETE_DISCUSSION_MESSAGE_SUCCESS = "@COMMONS/DELETE_DISCUSSION_MESSAGE_SUCCESS",
  DELETE_DISCUSSION_MESSAGE_FAILURE = "@COMMONS/DELETE_DISCUSSION_MESSAGE_FAILURE",

  UPDATE_DISCUSSION_MESSAGE = "@COMMONS/UPDATE_DISCUSSION_MESSAGE",
  UPDATE_DISCUSSION_MESSAGE_SUCCESS = "@COMMONS/UPDATE_DISCUSSION_MESSAGE_SUCCESS",
  UPDATE_DISCUSSION_MESSAGE_FAILURE = "@COMMONS/UPDATE_DISCUSSION_MESSAGE_FAILURE",

  CREATE_REPORT = "@COMMONS/CREATE_REPORT",
  CREATE_REPORT_SUCCESS = "@COMMONS/CREATE_REPORT_SUCCESS",
  CREATE_REPORT_FAILURE = "@COMMONS/CREATE_REPORT_FAILURE",

  SET_DISCUSSION_MESSAGE_REPLY = "@COMMONS/SET_DISCUSSION_MESSAGE_REPLY",
  CLEAR_DISCUSSION_MESSAGE_REPLY = "@COMMONS/CLEAR_DISCUSSION_MESSAGE_REPLY",

  GET_COMMON_STATE = "@COMMONS/GET_COMMON_STATE",
  GET_COMMON_STATE_SUCCESS = "@COMMONS/GET_COMMON_STATE_SUCCESS",
  GET_COMMON_STATE_FAILURE = "@COMMONS/GET_COMMON_STATE_FAILURE",

  UPDATE_COMMON_STATE = "@COMMONS/UPDATE_COMMON_STATE",

  UPDATE_GOVERNANCE_RULES = "@COMMONS/UPDATE_GOVERNANCE_RULES",
  UPDATE_GOVERNANCE_RULES_SUCCESS = "@COMMONS/UPDATE_GOVERNANCE_RULES_SUCCESS",
  UPDATE_GOVERNANCE_RULES_FAILURE = "@COMMONS/UPDATE_GOVERNANCE_RULES_FAILURE",
}
