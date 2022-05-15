import { BaseEntity } from "./BaseEntity";
import { BasicArgsProposal } from "./BasicArgsProposal";
import { ProposalsTypes } from "./governance/GovernanceProposals";
import { FundsAllocation } from "./proposals/FundsAllocation";
import { FundsRequest } from "./proposals/FundsRequest";
import { MemberAdmittance } from "./proposals/MemberAdmittance";

type ProposalInProgressKeys = 'data' | 'state' | 'votes' | 'type' | 'approvalDate' | 'moderation' | keyof BaseEntity | keyof BasicArgsProposal;

/**
 * Rules derived from Governance collection based on proposal keys
 */
export interface Proposals {
  [ProposalsTypes.MEMBER_ADMITTANCE]: Omit<MemberAdmittance, ProposalInProgressKeys>
  [ProposalsTypes.FUNDS_REQUEST]: Omit<FundsRequest, ProposalInProgressKeys>
  [ProposalsTypes.FUNDS_ALLOCATION]: Omit<FundsAllocation, ProposalInProgressKeys>
  // Expended for each proposal
}
