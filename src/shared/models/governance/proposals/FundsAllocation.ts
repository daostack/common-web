import { AllocateFundsTo, ProposalsTypes } from "@/shared/constants";
import { DocInfo, PaymentAmount } from "@/shared/models";
import { Timestamp } from "../../Timestamp";
import { BaseProposal } from "./BaseProposal";
import { BasicArgsProposal } from "./BasicArgsProposal";

export enum FundingAllocationStatus {
  PENDING_PROPOSAL_APPROVAL = "PENDING_PROPOSAL_APPROVAL",
  PASSED_INSUFFICIENT_BALANCE = "PASSED_INSUFFICIENT_BALANCE",
  PENDING_INVOICE_UPLOAD = "PENDING_INVOICE_UPLOAD",
  EXPIRED_INVOICES_NOT_UPLOADED = "EXPIRED_INVOICES_NOT_UPLOADED",
  PENDING_INVOICE_APPROVAL = "PENDING_INVOICE_APPROVAL",
  PENDING_SELLER_APPROVAL = "PENDING_SELLER_APPROVAL",
  PENDING_WALLET_TRANSFER = "PENDING_WALLET_TRANSFER",
  PENDING_BANK_WITHDRAWAL = "PENDING_BANK_WITHDRAWAL",
  COMPLETED = "COMPLETED",
}

export interface FundsAllocationArgs extends BasicArgsProposal {
  amount: PaymentAmount;
  to: AllocateFundsTo;
  subcommonId?: string | null;
  otherMemberId?: string | null;
}

export interface FundsAllocation extends BaseProposal {
  data: {
    votingExpiresOn: Timestamp | null;
    discussionExpiresOn: Timestamp | null;
    args: FundsAllocationArgs;
    legal: {
      payoutDocs: DocInfo[];

      payoutDocsUserComment: string | null;

      totalInvoicesAmount: number | null;

      payoutDocsRejectionReason: string | null;
    };
    tracker: {
      status: FundingAllocationStatus;

      invoicesNotUploadedNotificationsCounter: number;

      trusteeApprovedAt: Timestamp | null;

      withdrawnAt: Timestamp | null;
    };
  };
  type: ProposalsTypes.FUNDS_ALLOCATION;
}
