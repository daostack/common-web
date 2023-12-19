import { ProposalsTypes } from "@/shared/constants";
import { Timestamp } from "../../Timestamp";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export enum FUNDING_TYPES {
  MONTHLY = "MONTHLY",
  SINGLE = "SINGLE",
}

export type FundsRequestArgs = BasicArgsProposal;

export interface FundsRequest extends BaseProposal {
  type: ProposalsTypes.FUNDS_REQUEST;
  data: {
    args: FundsRequestArgs;
    votingExpiresOn: Timestamp | null;
    discussionExpiresOn: Timestamp | null;
  };
  limitations: {
    minAmount: number;
    maxAmount: number;
  };
  local: {
    allowedPaymentTypes: {
      [FUNDING_TYPES.MONTHLY]: boolean;
      [FUNDING_TYPES.SINGLE]: boolean;
    };
  };
}
