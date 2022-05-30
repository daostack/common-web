import {
  FundsAllocation,
  FundsRequest,
  MemberAdmittance,
} from "@/shared/models/governance/proposals";
import { DiscussionMessage } from "./DiscussionMessage";
import { VoteOutcome } from "./Votes";
import { User } from "./User";

export enum ProposalFundingState {
  NotRelevant = "notRelevant",
  NotAvailable = "notAvailable",
  Available = "available",
  Funded = "funded",
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

interface ProposalJoin {
  __typename?: "ProposalJoin";
  cardId: string;
  funding: number;
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

interface ExtendedProposalOptions {
  discussionMessage?: DiscussionMessage[];
  proposer?: User;
}

export type Proposal = (MemberAdmittance | FundsRequest | FundsAllocation) &
  ExtendedProposalOptions;

export interface ProposalWithHighlightedComment
  extends FundsAllocation,
    ExtendedProposalOptions {
  highlightedCommentId: string;
}

export interface ProposalListItem {
  proposal: Proposal;
  loadProposalDetails: (payload: Proposal) => void;
}

export const isProposalWithHighlightedComment = (
  proposal: any
): proposal is ProposalWithHighlightedComment =>
  proposal && proposal.highlightedCommentId;

export const isDocInfo = (data: any): data is DocInfo => data.downloadURL;
