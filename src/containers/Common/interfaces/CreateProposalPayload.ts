import { ProposalsTypes } from "@/shared/constants";
import {
  FundsAllocation,
  MemberAdmittance,
} from "@/shared/models/governance/proposals";

interface CreateFundsAllocation {
  type: ProposalsTypes.FUNDS_ALLOCATION;
  args: Omit<FundsAllocation["data"]["args"], "proposerId">;
}

interface CreateMemberAdmittance {
  type: ProposalsTypes.MEMBER_ADMITTANCE;
  args: Omit<MemberAdmittance["data"]["args"], "proposerId">;
}

interface Request<P, R> {
  data: P;
  response: R;
}

export interface CreateProposal {
  [ProposalsTypes.FUNDS_ALLOCATION]: Request<
    CreateFundsAllocation,
    FundsAllocation
  >;
  [ProposalsTypes.MEMBER_ADMITTANCE]: Request<
    CreateMemberAdmittance,
    MemberAdmittance
  >;
}
