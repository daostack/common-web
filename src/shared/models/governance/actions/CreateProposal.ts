import { ProposalsTypes } from "@/shared/constants";
import {
  FundsAllocationArgs,
  FundsRequestArgs,
  MemberAdmittanceArgs,
} from "../proposals";
import { BaseAction } from "./BaseAction";

export interface CreateProposal extends BaseAction {
  proposal: ProposalsTypes;
  [ProposalsTypes.MEMBER_ADMITTANCE]: MemberAdmittanceArgs;
  [ProposalsTypes.FUNDS_ALLOCATION]: FundsAllocationArgs;
  [ProposalsTypes.FUNDS_REQUEST]: FundsRequestArgs;
  // cont for each proposal type
}
