import { createAsyncAction, createStandardAction } from "typesafe-actions";

import {
  CreateFundingRequestProposalPayload,
  ProposalJoinRequestData,
} from "../../../shared/interfaces/api/proposal";
import { Common, Proposal, Discussion } from "../../../shared/models";
import { CommonsActionTypes } from "./constants";
import {
  CreateDiscussionDto,
  AddMessageToDiscussionDto,
  DeleteCommon,
} from "@/containers/Common/interfaces";
import { AddProposalSteps } from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent";
import { PayloadWithCallback } from "@/shared/interfaces";

export const getCommonsList = createAsyncAction(
  CommonsActionTypes.GET_COMMONS_LIST,
  CommonsActionTypes.GET_COMMONS_LIST_SUCCESS,
  CommonsActionTypes.GET_COMMONS_LIST_FAILURE
)<void, Common[], Error>();

export const getCommonDetail = createAsyncAction(
  CommonsActionTypes.GET_COMMON_DETAIL,
  CommonsActionTypes.GET_COMMON_DETAIL_SUCCESS,
  CommonsActionTypes.GET_COMMON_DETAIL_FAILURE
)<string, Common | null, Error>();

export const updatePage = createStandardAction(
  CommonsActionTypes.UPDATE_PAGE
)<number>();

export const setDiscussion = createStandardAction(
  CommonsActionTypes.SET_DISCUSSION
)<Discussion[]>();

export const setProposals = createStandardAction(
  CommonsActionTypes.SET_PROPOSALS
)<Proposal[]>();

export const clearCurrentDiscussion = createStandardAction(
  CommonsActionTypes.CLEAR_CURRENT_DISCUSSION
)();

export const clearCurrentProposal = createStandardAction(
  CommonsActionTypes.CLEAR_CURRENT_PROPOSAL
)();

export const loadCommonDiscussionList = createAsyncAction(
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS,
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS_SUCCESS,
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS_FAILURE
)<void, Discussion[], Error>();

export const loadDisscussionDetail = createAsyncAction(
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL,
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL_SUCCESS,
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL_FAILURE
)<Discussion, Discussion, Error>();

export const closeCurrentCommon = createStandardAction(
  CommonsActionTypes.CLOSE_CURRENT_COMMON
)();

export const loadProposalList = createAsyncAction(
  CommonsActionTypes.LOAD_PROPOSAL_LIST,
  CommonsActionTypes.LOAD_PROPOSAL_LIST_SUCCESS,
  CommonsActionTypes.LOAD_PROPOSAL_LIST_FAILURE
)<void, Proposal[], Error>();

export const loadProposalDetail = createAsyncAction(
  CommonsActionTypes.LOAD_PROPOSAL_DETAIL,
  CommonsActionTypes.LOAD_PROPOSAL_DETAIL_SUCCESS,
  CommonsActionTypes.LOAD_PROPOSAL_DETAIL_FAILURE
)<Proposal, Proposal, Error>();

export const loadUserProposalList = createAsyncAction(
  CommonsActionTypes.LOAD_USER_PROPOSAL_LIST,
  CommonsActionTypes.LOAD_USER_PROPOSAL_LIST_SUCCESS,
  CommonsActionTypes.LOAD_USER_PROPOSAL_LIST_FAILURE
)<string, Proposal[], Error>();

export const createDiscussion = createAsyncAction(
  CommonsActionTypes.CREATE_DISCUSSION,
  CommonsActionTypes.CREATE_DISCUSSION_SUCCESS,
  CommonsActionTypes.CREATE_DISCUSSION_FAILURE
)<
  { payload: CreateDiscussionDto; callback: (payload: Discussion) => void },
  Discussion[],
  Error
>();

export const addMessageToDiscussion = createAsyncAction(
  CommonsActionTypes.ADD_MESSAGE_TO_DISCUSSION,
  CommonsActionTypes.ADD_MESSAGE_TO_DISCUSSION_SUCCESS,
  CommonsActionTypes.ADD_MESSAGE_TO_DISCUSSION_FAILURE
)<
  {
    payload: AddMessageToDiscussionDto;
    discussion: Discussion;
  },
  Discussion,
  Error
>();

export const createRequestToJoin = createAsyncAction(
  CommonsActionTypes.CREATE_REQUEST_TO_JOIN,
  CommonsActionTypes.CREATE_REQUEST_TO_JOIN_SUCCESS,
  CommonsActionTypes.CREATE_REQUEST_TO_JOIN_FAILURE
)<ProposalJoinRequestData, Proposal, Error>();

export const createFundingProposal = createAsyncAction(
  CommonsActionTypes.CREATE_FUNDING_PROPOSAL,
  CommonsActionTypes.CREATE_FUNDING_PROPOSAL_SUCCESS,
  CommonsActionTypes.CREATE_FUNDING_PROPOSAL_FAILURE
)<
  {
    payload: CreateFundingRequestProposalPayload;
    callback: (step: AddProposalSteps) => void;
  },
  Proposal,
  Error
>();

export const checkUserPaymentMethod = createAsyncAction(
  CommonsActionTypes.CHECK_USER_PAYMENT_METHOD,
  CommonsActionTypes.CHECK_USER_PAYMENT_METHOD_SUCCESS,
  CommonsActionTypes.CHECK_USER_PAYMENT_METHOD_FAILURE
)<void, boolean, Error>();

export const addMessageToProposal = createAsyncAction(
  CommonsActionTypes.ADD_MESSAGE_TO_PROPOSAL,
  CommonsActionTypes.ADD_MESSAGE_TO_PROPOSAL_SUCCESS,
  CommonsActionTypes.ADD_MESSAGE_TO_PROPOSAL_FAILURE
)<
  {
    payload: AddMessageToDiscussionDto;
    proposal: Proposal;
  },
  Proposal,
  Error
>();

export const deleteCommon = createAsyncAction(
  CommonsActionTypes.DELETE_COMMON,
  CommonsActionTypes.DELETE_COMMON_SUCCESS,
  CommonsActionTypes.DELETE_COMMON_FAILURE
)<PayloadWithCallback<DeleteCommon, void, Error>, void, Error>();
