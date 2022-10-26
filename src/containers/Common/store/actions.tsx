import { createAsyncAction, createStandardAction } from "typesafe-actions";

import { LoadingState, PayloadWithCallback } from "@/shared/interfaces";
import { BuyerTokenPageCreationData } from "@/shared/interfaces/api/payMe";
import { SubscriptionUpdateData } from "@/shared/interfaces/api/subscription";
import {
  BankAccountDetails,
  Card,
  Common,
  CommonMember,
  CommonMemberWithUserInfo,
  CommonPayment,
  Governance,
  Proposal,
  Discussion,
  DiscussionWithHighlightedMessage,
  Payment,
  Subscription,
  Vote,
  DiscussionMessage,
} from "@/shared/models";
import { Tabs } from "@/containers/Common";
import { PayloadWithOptionalCallback } from "@/shared/interfaces";
import { CommonsActionTypes } from "./constants";
import {
  CreateDiscussionDto,
  CreateCommonPayload,
  CreateGovernancePayload,
  CreateDiscussionMessageDto,
  DeleteCommon,
  LeaveCommon,
  CreateProposal,
  UpdateCommonPayload,
  UpdateGovernancePayload,
  CreateReportDto,
} from "@/containers/Common/interfaces";
import {
  CreateVotePayload,
  UpdateVotePayload,
} from "@/shared/interfaces/api/vote";
import { BankAccountDetails as AddBankDetailsPayload } from "@/shared/models/BankAccountDetails";
import { CalculatedVotes } from "@/shared/models/governance/proposals";
import {
  ImmediateContributionData,
  ImmediateContributionResponse,
} from "../interfaces";
import { ProposalsTypes } from "@/shared/constants";
import { UpdateDiscussionMessageDto } from "../interfaces/UpdateDiscussionMessageDto";

export const createGovernance = createAsyncAction(
  CommonsActionTypes.CREATE_GOVERNANCE,
  CommonsActionTypes.CREATE_GOVERNANCE_SUCCESS,
  CommonsActionTypes.CREATE_GOVERNANCE_FAILURE
)<PayloadWithCallback<CreateGovernancePayload, void, Error>, void, Error>();

export const getCommonsList = createAsyncAction(
  CommonsActionTypes.GET_COMMONS_LIST,
  CommonsActionTypes.GET_COMMONS_LIST_SUCCESS,
  CommonsActionTypes.GET_COMMONS_LIST_FAILURE
)<void, Common[], Error>();

export const getCommonsListByIds = createAsyncAction(
  CommonsActionTypes.GET_COMMONS_LIST_BY_IDS,
  CommonsActionTypes.GET_COMMONS_LIST_BY_IDS_SUCCESS,
  CommonsActionTypes.GET_COMMONS_LIST_BY_IDS_FAILURE
)<PayloadWithOptionalCallback<string[], Common[], Error>, Common[], Error>();

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

export const setCommonActiveTab = createStandardAction(
  CommonsActionTypes.SET_ACTIVE_TAB
)<Tabs | null>();

export const clearCurrentDiscussion = createStandardAction(
  CommonsActionTypes.CLEAR_CURRENT_DISCUSSION
)();

export const updateCurrentProposal = createStandardAction(
  CommonsActionTypes.UPDATE_CURRENT_PROPOSAL
)<Proposal>();

export const clearCurrentProposal = createStandardAction(
  CommonsActionTypes.CLEAR_CURRENT_PROPOSAL
)();

export const clearCommonActiveTab = createStandardAction(
  CommonsActionTypes.CLEAR_ACTIVE_TAB
)();

export const loadCommonDiscussionList = createAsyncAction(
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS,
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS_SUCCESS,
  CommonsActionTypes.LOAD_COMMON_DISCUSSIONS_FAILURE
)<void, Discussion[], Error>();

export const loadDiscussionDetail = createAsyncAction(
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL,
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL_SUCCESS,
  CommonsActionTypes.LOAD_DISCUSSION_DETAIL_FAILURE
)<
  Discussion | DiscussionWithHighlightedMessage,
  Discussion | DiscussionWithHighlightedMessage,
  Error
>();

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
  {
    payload: CreateDiscussionDto;
    callback: (payload: Discussion) => void;
  },
  Discussion[],
  Error
>();

export const addMessageToDiscussion = createAsyncAction(
  CommonsActionTypes.ADD_MESSAGE_TO_DISCUSSION,
  CommonsActionTypes.ADD_MESSAGE_TO_DISCUSSION_SUCCESS,
  CommonsActionTypes.ADD_MESSAGE_TO_DISCUSSION_FAILURE
)<
  {
    payload: CreateDiscussionMessageDto;
    discussion: Discussion;
  },
  Discussion,
  Error
>();

export const deleteDiscussionMessage = createAsyncAction(
  CommonsActionTypes.DELETE_DISCUSSION_MESSAGE,
  CommonsActionTypes.DELETE_DISCUSSION_MESSAGE_SUCCESS,
  CommonsActionTypes.DELETE_DISCUSSION_MESSAGE_FAILURE
)<
  PayloadWithCallback<
    { 
      discussionId: string;
      discussionMessageId: string;
      isProposalMessage: boolean;
    },
    DiscussionMessage,
    Error
  >,
  null,
  Error
>();

export const updateDiscussionMessage = createAsyncAction(
  CommonsActionTypes.UPDATE_DISCUSSION_MESSAGE,
  CommonsActionTypes.UPDATE_DISCUSSION_MESSAGE_SUCCESS,
  CommonsActionTypes.UPDATE_DISCUSSION_MESSAGE_FAILURE
)<
{
  payload: UpdateDiscussionMessageDto;
  discussionId: string;
  isProposalMessage: boolean;
  callback: (isSucceed: boolean) => void;
},
  null,
  Error
>();

export const createMemberAdmittanceProposal = createAsyncAction(
  CommonsActionTypes.CREATE_MEMBER_ADMITTANCE_PROPOSAL,
  CommonsActionTypes.CREATE_MEMBER_ADMITTANCE_PROPOSAL_SUCCESS,
  CommonsActionTypes.CREATE_MEMBER_ADMITTANCE_PROPOSAL_FAILURE
)<
  PayloadWithOptionalCallback<
    Omit<CreateProposal[ProposalsTypes.MEMBER_ADMITTANCE]["data"], "type">,
    CreateProposal[ProposalsTypes.MEMBER_ADMITTANCE]["response"],
    Error
  >,
  CreateProposal[ProposalsTypes.MEMBER_ADMITTANCE]["response"],
  Error
>();

export const createAssignCircleProposal = createAsyncAction(
  CommonsActionTypes.CREATE_ASSIGN_CIRCLE_PROPOSAL,
  CommonsActionTypes.CREATE_ASSIGN_CIRCLE_PROPOSAL_SUCCESS,
  CommonsActionTypes.CREATE_ASSIGN_CIRCLE_PROPOSAL_FAILURE
)<
  PayloadWithOptionalCallback<
    Omit<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"], "type">,
    CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["response"],
    Error
  >,
  CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["response"],
  Error
>();

export const createRemoveCircleProposal = createAsyncAction(
  CommonsActionTypes.CREATE_REMOVE_CIRCLE_PROPOSAL,
  CommonsActionTypes.CREATE_REMOVE_CIRCLE_PROPOSAL_SUCCESS,
  CommonsActionTypes.CREATE_REMOVE_CIRCLE_PROPOSAL_FAILURE
)<
  PayloadWithOptionalCallback<
    Omit<CreateProposal[ProposalsTypes.REMOVE_CIRCLE]["data"], "type">,
    CreateProposal[ProposalsTypes.REMOVE_CIRCLE]["response"],
    Error
  >,
  CreateProposal[ProposalsTypes.REMOVE_CIRCLE]["response"],
  Error
>();

export const createFundingProposal = createAsyncAction(
  CommonsActionTypes.CREATE_FUNDING_PROPOSAL,
  CommonsActionTypes.CREATE_FUNDING_PROPOSAL_SUCCESS,
  CommonsActionTypes.CREATE_FUNDING_PROPOSAL_FAILURE
)<
  PayloadWithCallback<
    Omit<CreateProposal[ProposalsTypes.FUNDS_ALLOCATION]["data"], "type">,
    CreateProposal[ProposalsTypes.FUNDS_ALLOCATION]["response"],
    string
  >,
  CreateProposal[ProposalsTypes.FUNDS_ALLOCATION]["response"],
  Error
>();

export const createSurvey = createAsyncAction(
  CommonsActionTypes.CREATE_SURVEY,
  CommonsActionTypes.CREATE_SURVEY_SUCCESS,
  CommonsActionTypes.CREATE_SURVEY_FAILURE
)<
  PayloadWithCallback<
    Omit<CreateProposal[ProposalsTypes.SURVEY]["data"], "type">,
    CreateProposal[ProposalsTypes.SURVEY]["response"],
    Error
  >,
  CreateProposal[ProposalsTypes.SURVEY]["response"],
  Error
>();

export const createDeleteCommonProposal = createAsyncAction(
  CommonsActionTypes.CREATE_DELETE_COMMON_PROPOSAL,
  CommonsActionTypes.CREATE_DELETE_COMMON_PROPOSAL_SUCCESS,
  CommonsActionTypes.CREATE_DELETE_COMMON_PROPOSAL_FAILURE
)<
  PayloadWithOptionalCallback<
    Omit<CreateProposal[ProposalsTypes.DELETE_COMMON]["data"], "type">,
    CreateProposal[ProposalsTypes.DELETE_COMMON]["response"],
    Error
  >,
  CreateProposal[ProposalsTypes.DELETE_COMMON]["response"],
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
    payload: CreateDiscussionMessageDto;
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

export const updateCommon = createAsyncAction(
  CommonsActionTypes.UPDATE_COMMON,
  CommonsActionTypes.UPDATE_COMMON_SUCCESS,
  CommonsActionTypes.UPDATE_COMMON_FAILURE
)<PayloadWithCallback<UpdateCommonPayload, Common, Error>, Common, Error>();

export const updateGovernance = createAsyncAction(
  CommonsActionTypes.UPDATE_GOVERNANCE,
  CommonsActionTypes.UPDATE_GOVERNANCE_SUCCESS,
  CommonsActionTypes.UPDATE_GOVERNANCE_FAILURE
)<PayloadWithCallback<UpdateGovernancePayload, Governance, Error>, Governance, Error>();

export const createVote = createAsyncAction(
  CommonsActionTypes.CREATE_VOTE,
  CommonsActionTypes.CREATE_VOTE_SUCCESS,
  CommonsActionTypes.CREATE_VOTE_FAILURE
)<
  PayloadWithCallback<
    {
      votePayload: CreateVotePayload;
      proposalVotes: CalculatedVotes;
      shouldWaitForVoteToBeApplied?: boolean;
    },
    Vote,
    Error
  >,
  void,
  Error
>();

export const updateVote = createAsyncAction(
  CommonsActionTypes.UPDATE_VOTE,
  CommonsActionTypes.UPDATE_VOTE_SUCCESS,
  CommonsActionTypes.UPDATE_VOTE_FAILURE
)<
  PayloadWithCallback<
    {
      votePayload: UpdateVotePayload;
      proposalVotes: CalculatedVotes;
    },
    Vote,
    Error
  >,
  void,
  Error
>();

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
)<
  PayloadWithCallback<AddBankDetailsPayload, BankAccountDetails, Error>,
  BankAccountDetails,
  Error
>();

export const updateBankDetails = createAsyncAction(
  CommonsActionTypes.UPDATE_BANK_DETAILS,
  CommonsActionTypes.UPDATE_BANK_DETAILS_SUCCESS,
  CommonsActionTypes.UPDATE_BANK_DETAILS_FAILURE
)<
  PayloadWithCallback<Partial<BankAccountDetails>, BankAccountDetails, Error>,
  BankAccountDetails,
  Error
>();

export const deleteBankDetails = createAsyncAction(
  CommonsActionTypes.DELETE_BANK_DETAILS,
  CommonsActionTypes.DELETE_BANK_DETAILS_SUCCESS,
  CommonsActionTypes.DELETE_BANK_DETAILS_FAILURE
)<
  PayloadWithCallback<void, BankAccountDetails, Error>,
  BankAccountDetails,
  Error
>();

export const getBankDetails = createAsyncAction(
  CommonsActionTypes.GET_BANK_DETAILS,
  CommonsActionTypes.GET_BANK_DETAILS_SUCCESS,
  CommonsActionTypes.GET_BANK_DETAILS_FAILURE
)<
  PayloadWithCallback<void, BankAccountDetails, Error>,
  BankAccountDetails,
  Error
>();

export const getUserContributionsToCommon = createAsyncAction(
  CommonsActionTypes.GET_USER_CONTRIBUTIONS_TO_COMMON,
  CommonsActionTypes.GET_USER_CONTRIBUTIONS_TO_COMMON_SUCCESS,
  CommonsActionTypes.GET_USER_CONTRIBUTIONS_TO_COMMON_FAILURE
)<
  PayloadWithCallback<{ commonId: string; userId: string }, Payment[], Error>,
  Payment[],
  Error
>();

export const getUserContributions = createAsyncAction(
  CommonsActionTypes.GET_USER_CONTRIBUTIONS,
  CommonsActionTypes.GET_USER_CONTRIBUTIONS_SUCCESS,
  CommonsActionTypes.GET_USER_CONTRIBUTIONS_FAILURE
)<PayloadWithCallback<string, Payment[], Error>, Payment[], Error>();

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

export const getUserSubscriptions = createAsyncAction(
  CommonsActionTypes.GET_USER_SUBSCRIPTIONS,
  CommonsActionTypes.GET_USER_SUBSCRIPTIONS_SUCCESS,
  CommonsActionTypes.GET_USER_SUBSCRIPTIONS_FAILURE
)<PayloadWithCallback<string, Subscription[], Error>, Subscription[], Error>();

export const updateSubscription = createAsyncAction(
  CommonsActionTypes.UPDATE_SUBSCRIPTION,
  CommonsActionTypes.UPDATE_SUBSCRIPTION_SUCCESS,
  CommonsActionTypes.UPDATE_SUBSCRIPTION_FAILURE
)<
  PayloadWithCallback<SubscriptionUpdateData, Subscription, Error>,
  Subscription,
  Error
>();

export const cancelSubscription = createAsyncAction(
  CommonsActionTypes.CANCEL_SUBSCRIPTION,
  CommonsActionTypes.CANCEL_SUBSCRIPTION_SUCCESS,
  CommonsActionTypes.CANCEL_SUBSCRIPTION_FAILURE
)<PayloadWithCallback<string, Subscription, Error>, Subscription, Error>();

export const getGovernance = createAsyncAction(
  CommonsActionTypes.GET_GOVERNANCE,
  CommonsActionTypes.GET_GOVERNANCE_SUCCESS,
  CommonsActionTypes.GET_GOVERNANCE_FAILURE
)<PayloadWithOptionalCallback<string, Governance, Error>, Governance, Error>();

export const getCommonMember = createAsyncAction(
  CommonsActionTypes.GET_COMMON_MEMBER,
  CommonsActionTypes.GET_COMMON_MEMBER_SUCCESS,
  CommonsActionTypes.GET_COMMON_MEMBER_FAILURE
)<
  PayloadWithOptionalCallback<
    { commonId: string; userId: string },
    CommonMember,
    Error
  >,
  CommonMember,
  Error
>();

export const getCommonMembers = createAsyncAction(
  CommonsActionTypes.GET_COMMON_MEMBERS,
  CommonsActionTypes.GET_COMMON_MEMBERS_SUCCESS,
  CommonsActionTypes.GET_COMMON_MEMBERS_FAILURE
)<
  PayloadWithOptionalCallback<string, CommonMemberWithUserInfo[], Error>,
  CommonMemberWithUserInfo[],
  Error
>();

export const getUserCommons = createAsyncAction(
  CommonsActionTypes.GET_USER_COMMONS,
  CommonsActionTypes.GET_USER_COMMONS_SUCCESS,
  CommonsActionTypes.GET_USER_COMMONS_FAILURE
)<PayloadWithOptionalCallback<string, Common[], Error>, Common[], Error>();

export const setCurrentDiscussionMessageReply = createStandardAction(
  CommonsActionTypes.SET_DISCUSSION_MESSAGE_REPLY
)<DiscussionMessage>();

export const clearCurrentDiscussionMessageReply = createStandardAction(
  CommonsActionTypes.CLEAR_DISCUSSION_MESSAGE_REPLY
)();

export const createReport = createAsyncAction(
  CommonsActionTypes.CREATE_REPORT,
  CommonsActionTypes.CREATE_REPORT_SUCCESS,
  CommonsActionTypes.CREATE_REPORT_FAILURE
)<
  {
    payload: CreateReportDto;
    discussionId: string;
    callback: (isSucceed: boolean) => void;
  },
  boolean,
  Error
>();

export const getCommonState = createAsyncAction(
  CommonsActionTypes.GET_COMMON_STATE,
  CommonsActionTypes.GET_COMMON_STATE_SUCCESS,
  CommonsActionTypes.GET_COMMON_STATE_FAILURE
)<
  PayloadWithOptionalCallback<
    { commonId: string; force?: boolean },
    Common | null,
    Error
  >,
  Common | null,
  Error
>();

export const updateCommonState = createStandardAction(
  CommonsActionTypes.UPDATE_COMMON_STATE
)<{
  commonId: string;
  state: LoadingState<Common | null>;
}>();
