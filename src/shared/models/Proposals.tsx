import { Moderation, Time } from "./shared";

import { CommonContributionType, DiscussionMessage, User } from ".";
import { VoteOutcome } from "./Votes";

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
}

export enum ProposalPaymentState {
  NotAttempted = "notAttempted",
  NotRelevant = "notRelevant",
  Confirmed = "confirmed",
  Pending = "pending",
  Failed = "failed",
}

export enum ProposalState {
  COUNTDOWN = "countdown",
  PASSED = "passed",
  REJECTED = "failed",
  PASSED_INSUFFICIENT_BALANCE = "passedInsufficientBalance",
  EXPIRED_INVOCIES_NOT_UPLOADED = "expiredInvociesNotUploaded",
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

export interface DocInfo<LegalType = number> {
  name: string;
  legalType: LegalType;
  amount?: number;
  mimeType: string;
  downloadURL: string;
}

export interface ProposalLink {
  title?: string;
  value: string;
}

export interface Vote {
  voteId: string;
  voteOutcome: VoteOutcome;
  voterId: string;
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

  updatedAt: Time;
  votes: Vote[];
  votesAgainst?: number;
  votesFor?: number;
  votesAbstained?: number;
  user?: User;
  proposer?: User;
  discussionMessage?: DiscussionMessage[];
  isLoaded?: boolean;

  title: string;

  state: string;
  description: {
    description: string;
    links: ProposalLink[];
    images: ProposalLink[];
    files: File[];
    title: string;
  };
  type: ProposalType;
  paymentState?: ProposalPaymentState;
  fundingState?: ProposalFundingState;
  /** Details about the join request. Exists only on join request proposals */
  join?: ProposalJoin;
  fundingProcessStage?: FundingProcessStage;

  approvalDate?: Time;
  payoutDocs?: DocInfo[];
  payoutDocsComment?: string;
  payoutDocsRejectionReason?: string;
}

export interface ProposalWithHighlightedComment extends Proposal {
  highlightedCommentId: string;
}

export interface ProposalListItem {
  proposal: Proposal;
  loadProposalDetails: (payload: Proposal) => void;
}

export const isProposalWithHighlightedComment = (proposal: any): proposal is ProposalWithHighlightedComment =>
  (proposal && proposal.highlightedCommentId);

export const isDocInfo = (data: any): data is DocInfo => data.downloadURL;
