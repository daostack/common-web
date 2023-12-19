import { ProposalsTypes } from "@/shared/constants";
import {
  BaseEntity,
  CirclesMap,
  Moderation,
  ProposalState,
  VoteOutcome,
  ResolutionType,
  SoftDeleteEntity,
} from "@/shared/models";
import { Timestamp } from "../../Timestamp";

export interface VoteTracker {
  [key: number]: {
    [VoteOutcome.Approved]: number;
    [VoteOutcome.Abstained]: number;
    [VoteOutcome.Rejected]: number;
  };
}

export interface CalculatedVotes {
  circles: VoteTracker;

  weightedApproved: number;

  weightedAbstained: number;

  weightedRejected: number;

  total: number;

  abstained: number;

  rejected: number;

  approved: number;

  totalMembersWithVotingRight: number;
}

export interface Weight {
  circles: CirclesMap;
  value: number;
}

export interface GlobalDefinition {
  votingDuration: number; // time in hours
  discussionDuration: number; // time in hours
  quorum: number; // required percentage of common member votes with voting rights (any vote)
  weights: Weight[]; // sum of values is 100%, ordered array by value (descending)
  minApprove: number; // weight based percentage
  maxReject: number; // weight based percentage
}

export interface BaseProposal extends BaseEntity, SoftDeleteEntity {
  global: GlobalDefinition;

  local: Record<string, unknown>;

  limitations: Record<string, unknown>;

  votes: CalculatedVotes;

  data: Record<string, unknown> & {
    votingExpiresOn: Timestamp | null;
    discussionExpiresOn: Timestamp | null;
  };

  state: ProposalState;

  approvalDate: Timestamp | null;

  discussionId: string;

  type: ProposalsTypes;

  moderation: Moderation;

  resolutionType: ResolutionType;
}
