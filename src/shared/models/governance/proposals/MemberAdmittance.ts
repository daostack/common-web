import { ProposalsTypes } from "@/shared/constants";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface MemberAdmittanceArgs extends BasicArgsProposal {
  circle?: string;
}

export interface MemberAdmittance extends BaseProposal {
  data: {
    args: MemberAdmittanceArgs;
  };
  type: ProposalsTypes.MEMBER_ADMITTANCE;
  local: {
    defaultCircle: string;
    optimisticAdmittance: boolean;
  };
}
