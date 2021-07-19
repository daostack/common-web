import { Moderation } from "./shared";

import { CommonContributionType, DiscussionMessage, User } from ".";

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

export enum ProposalVoteOutcome {
  Approved = "approved",
  Rejected = "rejected",
}

export enum ProposalState {
  PassedInsufficientBalance = "passedInsufficientBalance",
  Countdown = "countdown",
  Passed = "passed",
  Failed = "failed",
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

export interface Proposal {
  commonId: string;
  countdownPeriod: number;
  createdAt: Date;
  expiresAt: Date;
  fundingRequest?: { funded: boolean; amount: number };

  id: string;
  moderation: Moderation;

  quietEndingPeriod: number;

  updatedAt: Date;
  votesAgainst?: number;
  votesFor?: number;
  user?: User;
  discussionMessage?: DiscussionMessage[];
  isLoaded?: boolean;

  title: string;

  state: string;
  description: string;
  type: ProposalType;
  paymentState?: ProposalPaymentState;
  fundingState?: ProposalFundingState;
  /** Details about the funding request. Exists only on funding request proposals */
  funding?: {
    amount: number;
  };
  /** Details about the join request. Exists only on join request proposals */
  join?: ProposalJoin;
  votes?: ProposalVote[];
}
