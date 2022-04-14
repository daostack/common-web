import { createAsyncAction, createStandardAction } from "typesafe-actions";

import { PayloadWithCallback } from "@/shared/interfaces";
import { BuyerTokenPageCreationData } from "@/shared/interfaces/api/payMe";
import {
  CreateFundingRequestProposalPayload,
  ProposalJoinRequestData,
} from "@/shared/interfaces/api/proposal";
import { SubscriptionUpdateData } from "@/shared/interfaces/api/subscription";
import {
  Card,
  Common,
  CommonPayment,
  Proposal,
  Discussion,
  Payment,
  Subscription,
} from "@/shared/models";
import { PayloadWithOptionalCallback } from "../../../shared/interfaces";
import { CommonsActionTypes } from "./constants";
import {
  CreateDiscussionDto,
  CreateCommonPayload,
  AddMessageToDiscussionDto,
  DeleteCommon,
  LeaveCommon,
} from "@/containers/Common/interfaces";
import { AddProposalSteps } from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent";
import { CreateVotePayload, UpdateVotePayload } from "@/shared/interfaces/api/vote";
import { BankAccountDetails as AddBankDetailsPayload } from "@/shared/models/BankAccountDetails";
import {
  ImmediateContributionData,
  ImmediateContributionResponse,
} from "../interfaces";

export const getCommonsList = createAsyncAction(
  CommonsActionTypes.GET_COMMONS_LIST,
  CommonsActionTypes.GET_COMMONS_LIST_SUCCESS,
  CommonsActionTypes.GET_COMMONS_LIST_FAILURE
)<void, Common[], Error>();

export const getCommonDetail = createAsyncAction(
  CommonsActionTypes.GET_COMMON_DETAIL,
  CommonsActionTypes.GET_COMMON_DETAIL_SUCCESS,
  CommonsActionTypes.GET_COMMON_DETAIL_FAILURE
)<
  PayloadWithOptionalCallback<string, Common | null, Error>,
  Common | null,
  Error
>();

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

export const loadUserCards = createAsyncAction(
  CommonsActionTypes.LOAD_USER_CARDS,
  CommonsActionTypes.LOAD_USER_CARDS_SUCCESS,
  CommonsActionTypes.LOAD_USER_CARDS_FAILURE
)<PayloadWithCallback<void, Card[], Error>, Card[], Error>();

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

export const leaveCommon = createAsyncAction(
  CommonsActionTypes.LEAVE_COMMON,
  CommonsActionTypes.LEAVE_COMMON_SUCCESS,
  CommonsActionTypes.LEAVE_COMMON_FAILURE
)<PayloadWithCallback<LeaveCommon, void, Error>, string, Error>();

export const deleteCommon = createAsyncAction(
  CommonsActionTypes.DELETE_COMMON,
  CommonsActionTypes.DELETE_COMMON_SUCCESS,
  CommonsActionTypes.DELETE_COMMON_FAILURE
)<PayloadWithCallback<DeleteCommon, void, Error>, string, Error>();

export const createCommon = createAsyncAction(
  CommonsActionTypes.CREATE_COMMON,
  CommonsActionTypes.CREATE_COMMON_SUCCESS,
  CommonsActionTypes.CREATE_COMMON_FAILURE
)<PayloadWithCallback<CreateCommonPayload, Common, Error>, Common, Error>();

export const createVote = createAsyncAction(
  CommonsActionTypes.CREATE_VOTE,
  CommonsActionTypes.CREATE_VOTE_SUCCESS,
  CommonsActionTypes.CREATE_VOTE_FAILURE
)<PayloadWithCallback<CreateVotePayload, void, Error>, void, Error>();

export const updateVote = createAsyncAction(
  CommonsActionTypes.UPDATE_VOTE,
  CommonsActionTypes.UPDATE_VOTE_SUCCESS,
  CommonsActionTypes.UPDATE_VOTE_FAILURE
)<PayloadWithCallback<UpdateVotePayload, void, Error>, void, Error>();

export const makeImmediateContribution = createAsyncAction(
  CommonsActionTypes.MAKE_IMMEDIATE_CONTRIBUTION,
  CommonsActionTypes.MAKE_IMMEDIATE_CONTRIBUTION_SUCCESS,
  CommonsActionTypes.MAKE_IMMEDIATE_CONTRIBUTION_FAILURE
)<
  PayloadWithCallback<
    ImmediateContributionData,
    ImmediateContributionResponse,
    Error
  >,
  ImmediateContributionResponse,
  Error
>();

export const createBuyerTokenPage = createAsyncAction(
  CommonsActionTypes.CREATE_BUYER_TOKEN_PAGE,
  CommonsActionTypes.CREATE_BUYER_TOKEN_PAGE_SUCCESS,
  CommonsActionTypes.CREATE_BUYER_TOKEN_PAGE_FAILURE
)<
  PayloadWithCallback<BuyerTokenPageCreationData, CommonPayment, Error>,
  CommonPayment,
  Error
>();

export const addBankDetails = createAsyncAction(
  CommonsActionTypes.ADD_BANK_DETAILS,
  CommonsActionTypes.ADD_BANK_DETAILS_SUCCESS,
  CommonsActionTypes.ADD_BANK_DETAILS_FAILURE
)<PayloadWithCallback<AddBankDetailsPayload, void, Error>, void, Error>();

export const getBankDetails = createAsyncAction(
  CommonsActionTypes.GET_BANK_DETAILS,
  CommonsActionTypes.GET_BANK_DETAILS_SUCCESS,
  CommonsActionTypes.GET_BANK_DETAILS_FAILURE
)<PayloadWithCallback<void, void, Error>, void, Error>();

export const getUserContributionsToCommon = createAsyncAction(
  CommonsActionTypes.GET_USER_CONTRIBUTIONS_TO_COMMON,
  CommonsActionTypes.GET_USER_CONTRIBUTIONS_TO_COMMON_SUCCESS,
  CommonsActionTypes.GET_USER_CONTRIBUTIONS_TO_COMMON_FAILURE
)<
  PayloadWithCallback<{ commonId: string; userId: string }, Payment[], Error>,
  Payment[],
  Error
>();

export const getUserSubscriptionToCommon = createAsyncAction(
  CommonsActionTypes.GET_USER_SUBSCRIPTION_TO_COMMON,
  CommonsActionTypes.GET_USER_SUBSCRIPTION_TO_COMMON_SUCCESS,
  CommonsActionTypes.GET_USER_SUBSCRIPTION_TO_COMMON_FAILURE
)<
  PayloadWithCallback<
    { commonId: string; userId: string },
    Subscription | null,
    Error
  >,
  Subscription | null,
  Error
>();

export const updateSubscription = createAsyncAction(
  CommonsActionTypes.UPDATE_SUBSCRIPTION,
  CommonsActionTypes.UPDATE_SUBSCRIPTION_SUCCESS,
  CommonsActionTypes.UPDATE_SUBSCRIPTION_FAILURE
)<
  PayloadWithCallback<SubscriptionUpdateData, Subscription, Error>,
  Subscription,
  Error
>();
