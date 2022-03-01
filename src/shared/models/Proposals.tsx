import { Moderation, Time } from "./shared";

import { CommonContributionType, DiscussionMessage, User } from ".";

export enum ProposalFundingState {
  NotRelevant = "notRelevant",
  NotAvailable = "notAvailable",
  Available = "available",
  Funded = "funded",
}

export enum FundingProcessStage {
  PendingInvoiceUpload = "pendingInvoiceUpload",
  PendingInvoiceApproval = "pendingInvoiceApproval",
  FundsTransferInProgress = "fundsTransferInProgress",
  Completed = "completed",
  ExpiredInvociesNotUploaded = "expiredInvociesNotUploaded",
}

export enum ProposalPaymentState {
  NotAttempted = "notAttempted",
  NotRelevant = "notRelevant",
  Confirmed = "confirmed",
  Pending = "pending",
  Failed = "failed",
}

export enum ProposalVoteOutcome {
  Approved = "approved",
  Rejected = "rejected",
}

export enum ProposalState {
  COUNTDOWN = "countdown",
  PASSED = "passed",
  REJECTED = "failed",
  PASSED_INSUFFICIENT_BALANCE = "passedInsufficientBalance",
}

export enum ProposalType {
  FundingRequest = "fundingRequest",
  Join = "join",
}

interface ProposalJoin {
  __typename?: "ProposalJoin";
  cardId: string;
  funding: number;
  fundingType?: CommonContributionType;
}

export type ProposalVote = {
  __typename?: "ProposalVote";
  voteId: string;
  voterId: string;
  outcome: ProposalVoteOutcome;
  voter?: User;
};

export interface DocInfo {
  name: string;
  legalType: number;
  amount?: number;
  mimeType: string;
  downloadURL: string;
}

export interface ProposalLink {
  title?: string;
  value: string;
}

export interface Proposal {
  commonId: string;
  proposerId: string;
  countdownPeriod: number;
  createTime: Time;
  createdAt: Time;
  expiresAt: Date;
  fundingRequest?: { funded: boolean; amount: number };

  id: string;
  moderation: Moderation;

  quietEndingPeriod: number;

  updatedAt: Date;
  votesAgainst?: number;
  votesFor?: number;
  user?: User;
  proposer?: User;
  discussionMessage?: DiscussionMessage[];
  isLoaded?: boolean;

  title: string;

  state: string;
  description: {
    description: string;
    links: ProposalLink[];
    images: File[];
    files: File[];
    title: string;
  };
  type: ProposalType;
  paymentState?: ProposalPaymentState;
  fundingState?: ProposalFundingState;
  /** Details about the join request. Exists only on join request proposals */
  join?: ProposalJoin;
  votes?: ProposalVote[];
  fundingProcessStage?: FundingProcessStage;

  approvalDate?: Time;
  payoutDocs?: DocInfo[];
  payoutDocsComment?: string
  payoutDocsRejectionReason?: string;
}
