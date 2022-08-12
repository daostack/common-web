import { ProposalsTypes } from "@/shared/constants";
import { BaseEntity } from "../../BaseEntity";
import { Proposal } from "../../Proposals";
import { circleIndex } from "../Circles";
import { AssignCircle } from "./AssignCircle";
import { BasicArgsProposal } from "./BasicArgsProposal";
import { FundsAllocation } from "./FundsAllocation";
import { MemberAdmittance } from "./MemberAdmittance";
import { RemoveCircle } from "./RemoveCircle";

type ProposalInProgressKeys =
  | "data"
  | "state"
  | "votes"
  | "type"
  | "approvalDate"
  | "moderation"
  | keyof BaseEntity
  | keyof BasicArgsProposal;

/**
 * Rules derived from Governance collection based on proposal keys
 */
export interface Proposals {
  [ProposalsTypes.MEMBER_ADMITTANCE]: Omit<
    MemberAdmittance,
    ProposalInProgressKeys
  >;
  [ProposalsTypes.FUNDS_ALLOCATION]: Omit<
    FundsAllocation,
    ProposalInProgressKeys
  >;
  [ProposalsTypes.ASSIGN_CIRCLE]: {
    [K in circleIndex]: Omit<AssignCircle, ProposalInProgressKeys>;
  };
  [ProposalsTypes.REMOVE_CIRCLE]: {
    [K in circleIndex]: Omit<RemoveCircle, ProposalInProgressKeys>;
  };
  // Expended for each proposal
}

export const isFundsAllocationProposal = (
  proposal?: Proposal | null
): proposal is FundsAllocation =>
  Boolean(proposal?.type === ProposalsTypes.FUNDS_ALLOCATION);

export const isMemberAdmittanceProposal = (
  proposal?: Proposal | null
): proposal is MemberAdmittance =>
  Boolean(proposal?.type === ProposalsTypes.MEMBER_ADMITTANCE);

export const isAssignCircleProposal = (
  proposal?: Proposal | null
): proposal is AssignCircle =>
  Boolean(proposal?.type === ProposalsTypes.ASSIGN_CIRCLE);

export const isRemoveCircleProposal = (
  proposal?: Proposal | null
): proposal is RemoveCircle =>
  Boolean(proposal?.type === ProposalsTypes.REMOVE_CIRCLE);

export * from "./AssignCircle";
export * from "./BaseProposal";
export * from "./BasicArgsProposal";
export * from "./FundsAllocation";
export * from "./FundsRequest";
export * from "./MemberAdmittance";
export * from "./RemoveCircle";
export * from "./Survey";

