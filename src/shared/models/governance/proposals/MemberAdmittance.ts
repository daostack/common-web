import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants";
import { circleIndex } from "../Circles";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";
import { PaymentAmount } from "@/shared/models/Payment";

export interface MemberAdmittanceArgs extends BasicArgsProposal {
  circle?: string;
}

export type MemberAdmittanceLimitations = {
    minFeeOneTime: PaymentAmount | null;
    minFeeMonthly: PaymentAmount | null;
    paymentMustGoThrough: boolean;
}

export interface MemberAdmittance extends BaseProposal {
  data: {
    votingExpiresOn: firebase.firestore.Timestamp | null;
    discussionExpiresOn: firebase.firestore.Timestamp | null;
    args: MemberAdmittanceArgs;
  };
  type: ProposalsTypes.MEMBER_ADMITTANCE;
  local: {
    defaultCircle: circleIndex;
    optimisticAdmittance: boolean;
  };
  limitations: {
    minFeeOneTime?: PaymentAmount;
    minFeeMonthly?: PaymentAmount;
    paymentMustGoThrough: boolean;
  }
}
