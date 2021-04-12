import { createAsyncAction, createStandardAction } from "typesafe-actions";

import { Common, Proposal, Discussion } from "../../../shared/models";
import { CommonsActionTypes } from "./constants";

export const getCommonsList = createAsyncAction(
  CommonsActionTypes.GET_COMMONS_LIST,
  CommonsActionTypes.GET_COMMONS_LIST_SUCCESS,
  CommonsActionTypes.GET_COMMONS_LIST_FAILURE,
)<void, Common[], Error>();

export const getCommonDetail = createAsyncAction(
  CommonsActionTypes.GET_COMMON_DETAIL,
  CommonsActionTypes.GET_COMMON_DETAIL_SUCCESS,
  CommonsActionTypes.GET_COMMON_DETAIL_FAILURE,
)<string, Common | null, Error>();

export const updatePage = createStandardAction(CommonsActionTypes.UPDATE_PAGE)<number>();

export const setDiscussion = createStandardAction(CommonsActionTypes.SET_DISCUSSION)<Discussion[]>();

export const setProposals = createStandardAction(CommonsActionTypes.SET_PROPOSALS)<Proposal[]>();

export const clearCurrentDiscussion = createStandardAction(CommonsActionTypes.CLEAR_CURRENT_DISCUSSION)();

export const loadCommonDiscussionList = createAsyncAction(
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS,
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS_SUCCESS,
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS_FAILURE,
)<void, Discussion[], Error>();

export const loadDisscussionDetail = createAsyncAction(
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL,
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL_SUCCESS,
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL_FAILURE,
)<Discussion, Discussion, Error>();

export const closeCurrentCommon = createStandardAction(CommonsActionTypes.CLOSE_CURRENT_COMMON)();

export const loadProposalList = createAsyncAction(
  CommonsActionTypes.LOAD_PROPOSAL_LIST,
  CommonsActionTypes.LOAD_PROPOSAL_LIST_SUCCESS,
  CommonsActionTypes.LOAD_PROPOSAL_LIST_FAILURE,
)<void, Proposal[], Error>();

export const loadProposalDetail = createAsyncAction(
  CommonsActionTypes.LOAD_PROPOSAL_DETAIL,
  CommonsActionTypes.LOAD_PROPOSAL_DETAIL_SUCCESS,
  CommonsActionTypes.LOAD_PROPOSAL_DETAIL_FAILURE,
)<Proposal, Proposal, Error>();
