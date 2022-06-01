import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants";
import {
  BaseEntity,
  Moderation,
  ProposalState,
  VoteOutcome,
} from "@/shared/models";

export interface VoteTracker {
  [key: string]: {
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
}

export interface BaseProposal extends BaseEntity {
  global: {
    duration: number; // time in hours
    quorum: number; // required percentage of common member votes (any vote)
    weights: {
      circles: string[]; // at least one circle is required
      value: number;
    }[]; // sum of values is 100%, ordered array by value (descending)
    minApprove: number; // weight based percentage
    maxReject: number; // weight based percentage
  };

  local: Record<string, unknown>;

  limitations: Record<string, unknown>;

  votes: CalculatedVotes

  data: Record<string, unknown>;

  state: ProposalState;

  approvalDate: firebase.firestore.Timestamp | null;

  type: ProposalsTypes;

  moderation: Moderation;
}
