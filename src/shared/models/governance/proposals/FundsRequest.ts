import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants";
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
    expiresOn: firebase.firestore.Timestamp;
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
