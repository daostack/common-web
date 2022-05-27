import { ProposalsTypes } from "@/shared/constants";
import { BaseEntity } from "../../BaseEntity";
import { Proposal } from "../../Proposals";
import { BasicArgsProposal } from "./BasicArgsProposal";
import { FundsAllocation } from "./FundsAllocation";
import { FundsRequest } from "./FundsRequest";
import { MemberAdmittance } from "./MemberAdmittance";

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
  [ProposalsTypes.FUNDS_REQUEST]: Omit<FundsRequest, ProposalInProgressKeys>;
  [ProposalsTypes.FUNDS_ALLOCATION]: Omit<
    FundsAllocation,
    ProposalInProgressKeys
  >;
  // Expended for each proposal
}

export const isFundsAllocationProposal = (
  proposal?: Proposal
): proposal is FundsAllocation =>
  Boolean(proposal?.type === ProposalsTypes.FUNDS_ALLOCATION);

export * from "./BaseProposal";
export * from "./BasicArgsProposal";
export * from "./FundsAllocation";
export * from "./FundsRequest";
export * from "./MemberAdmittance";
