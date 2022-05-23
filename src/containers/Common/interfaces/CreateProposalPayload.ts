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

export type CreateProposalPayload =
  | CreateFundsAllocation
  | CreateMemberAdmittance;

export type CreateProposalResponse = FundsAllocation | MemberAdmittance;
