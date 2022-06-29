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
    votingExpiresOn: firebase.firestore.Timestamp | null;
    discussionExpiresOn: firebase.firestore.Timestamp | null;
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
