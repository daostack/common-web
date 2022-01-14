import { createAsyncAction } from "typesafe-actions";
import { Proposal } from "../../../shared/models";
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
)<void, Proposal, Error>();
