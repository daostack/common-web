import { createSelector } from "reselect";
import { AppState } from "../../../shared/interfaces";

const selectTrustee = (state: AppState) => state.trustee;

export const selectPendingApprovalProposals = () =>
  createSelector(selectTrustee, (state) => state.pendingApprovalProposals);
export const selectApprovedProposals = () =>
  createSelector(selectTrustee, (state) => state.approvedProposals);
export const selectDeclinedProposals = () =>
  createSelector(selectTrustee, (state) => state.declinedProposals);
export const selectProposalForApproval = () =>
  createSelector(selectTrustee, (state) => state.proposalForApproval);
export const selectIsProposalForApprovalLoaded = () =>
  createSelector(selectTrustee, (state) => state.isProposalForApprovalLoaded);
