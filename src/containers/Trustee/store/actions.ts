import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { PayloadWithCallback } from "@/shared/interfaces";
import { Common, User } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import { ApproveOrDeclineProposalDto } from "../interfaces";
import { TrusteeActionTypes } from "./constants";

export const getPendingApprovalProposals = createAsyncAction(
  TrusteeActionTypes.GET_PENDING_APPROVAL_PROPOSALS,
  TrusteeActionTypes.GET_PENDING_APPROVAL_PROPOSALS_SUCCESS,
  TrusteeActionTypes.GET_PENDING_APPROVAL_PROPOSALS_FAILURE
)<void, FundsAllocation[], Error>();

export const getApprovedProposals = createAsyncAction(
  TrusteeActionTypes.GET_APPROVED_PROPOSALS,
  TrusteeActionTypes.GET_APPROVED_PROPOSALS_SUCCESS,
  TrusteeActionTypes.GET_APPROVED_PROPOSALS_FAILURE
)<void, FundsAllocation[], Error>();

export const getDeclinedProposals = createAsyncAction(
  TrusteeActionTypes.GET_DECLINED_PROPOSALS,
  TrusteeActionTypes.GET_DECLINED_PROPOSALS_SUCCESS,
  TrusteeActionTypes.GET_DECLINED_PROPOSALS_FAILURE
)<void, FundsAllocation[], Error>();

export const getProposalsData = createAsyncAction(
  TrusteeActionTypes.GET_PROPOSALS_DATA,
  TrusteeActionTypes.GET_PROPOSALS_DATA_SUCCESS,
  TrusteeActionTypes.GET_PROPOSALS_DATA_FAILURE
)<
  { commonIds: string[]; userIds: string[] },
  { commons: Common[]; users: User[] },
  Error
>();

export const updateProposalsData = createStandardAction(
  TrusteeActionTypes.UPDATE_PROPOSALS_DATA
)<{ commonIds: string[]; userIds: string[] }>();

export const clearProposals = createStandardAction(
  TrusteeActionTypes.CLEAR_PROPOSALS
)();

export const getProposalForApproval = createAsyncAction(
  TrusteeActionTypes.GET_PROPOSAL_FOR_APPROVAL,
  TrusteeActionTypes.GET_PROPOSAL_FOR_APPROVAL_SUCCESS,
  TrusteeActionTypes.GET_PROPOSAL_FOR_APPROVAL_FAILURE
)<string, FundsAllocation, Error>();

export const clearProposalForApproval = createStandardAction(
  TrusteeActionTypes.CLEAR_PROPOSAL_FOR_APPROVAL
)();

export const approveOrDeclineProposal = createAsyncAction(
  TrusteeActionTypes.APPROVE_OR_DECLINE_PROPOSAL,
  TrusteeActionTypes.APPROVE_OR_DECLINE_PROPOSAL_SUCCESS,
  TrusteeActionTypes.APPROVE_OR_DECLINE_PROPOSAL_FAILURE
)<PayloadWithCallback<ApproveOrDeclineProposalDto, void, Error>, void, Error>();
