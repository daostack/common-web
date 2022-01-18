import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { PayloadWithCallback } from "../../../shared/interfaces";
import { Proposal } from "../../../shared/models";
import { ApproveOrDeclineProposalDto } from "../interfaces";
import { TrusteeActionTypes } from "./constants";

export const getPendingApprovalProposals = createAsyncAction(
  TrusteeActionTypes.GET_PENDING_APPROVAL_PROPOSALS,
  TrusteeActionTypes.GET_PENDING_APPROVAL_PROPOSALS_SUCCESS,
  TrusteeActionTypes.GET_PENDING_APPROVAL_PROPOSALS_FAILURE
)<void, Proposal[], Error>();

export const getApprovedProposals = createAsyncAction(
  TrusteeActionTypes.GET_APPROVED_PROPOSALS,
  TrusteeActionTypes.GET_APPROVED_PROPOSALS_SUCCESS,
  TrusteeActionTypes.GET_APPROVED_PROPOSALS_FAILURE
)<void, Proposal[], Error>();

export const getDeclinedProposals = createAsyncAction(
  TrusteeActionTypes.GET_DECLINED_PROPOSALS,
  TrusteeActionTypes.GET_DECLINED_PROPOSALS_SUCCESS,
  TrusteeActionTypes.GET_DECLINED_PROPOSALS_FAILURE
)<void, Proposal[], Error>();

export const getProposalForApproval = createAsyncAction(
  TrusteeActionTypes.GET_PROPOSAL_FOR_APPROVAL,
  TrusteeActionTypes.GET_PROPOSAL_FOR_APPROVAL_SUCCESS,
  TrusteeActionTypes.GET_PROPOSAL_FOR_APPROVAL_FAILURE
)<string, Proposal, Error>();

export const clearProposalForApproval = createStandardAction(
  TrusteeActionTypes.CLEAR_PROPOSAL_FOR_APPROVAL
)();

export const approveOrDeclineProposal = createAsyncAction(
  TrusteeActionTypes.APPROVE_OR_DECLINE_PROPOSAL,
  TrusteeActionTypes.APPROVE_OR_DECLINE_PROPOSAL_SUCCESS,
  TrusteeActionTypes.APPROVE_OR_DECLINE_PROPOSAL_FAILURE
)<PayloadWithCallback<ApproveOrDeclineProposalDto, void, Error>, void, Error>();
