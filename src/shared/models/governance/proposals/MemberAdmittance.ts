import { ProposalsTypes } from "@/shared/constants";
import { PaymentAmount } from "@/shared/models/Payment";
import { Timestamp } from "../../Timestamp";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export interface MemberAdmittanceArgs extends BasicArgsProposal {
  circle?: string;
}

export type MemberAdmittanceLimitations = {
  minFeeOneTime: PaymentAmount | null;
  minFeeMonthly: PaymentAmount | null;
  paymentMustGoThrough: boolean;
};

export interface MemberAdmittance extends BaseProposal {
  data: {
    votingExpiresOn: Timestamp | null;
    discussionExpiresOn: Timestamp | null;
    args: MemberAdmittanceArgs;
  };
  type: ProposalsTypes.MEMBER_ADMITTANCE;
  local: {
    defaultCircle: string;
    optimisticAdmittance: boolean;
  };
  limitations: MemberAdmittanceLimitations;
}
