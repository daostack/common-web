import { BasicArgsProposal } from "../BasicArgsProposal"
import { ProposalsTypes } from "../governance/GovernanceProposals"
import { BaseProposal } from "./BaseProposal"

export interface MemberAdmittanceArgs extends BasicArgsProposal {
  circle?: string
}

export interface MemberAdmittance extends BaseProposal {
  data: {
    args: MemberAdmittanceArgs
  },
  type: ProposalsTypes.MEMBER_ADMITTANCE,
  local: {
    defaultCircle: string
    optimisticAdmittance: boolean
  }
}
