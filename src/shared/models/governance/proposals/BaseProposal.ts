import firebase from "firebase/app";
import { ProposalsTypes } from "@/shared/constants";
import {
  BaseEntity,
  Moderation,
  ProposalState,
  Vote,
  VoteOutcome,
} from "@/shared/models";

export interface VoteTracker {
  [key: string]: {
    [VoteOutcome.Approved]: number;
    [VoteOutcome.Abstained]: number;
    [VoteOutcome.Rejected]: number;
  };
}

export interface BaseProposal extends BaseEntity {
  global: {
    duration: number; // time in hours
    quorum: number; // required percentage of common member votes (any vote)
    weights: [
      {
        circles: [string, ...string[]];
        value: number;
      },
      ...[]
    ]; // sum of values is 100%, ordered array by value (descending)
    minApprove: number; // weight based percentage
    maxReject: number; // weight based percentage
  };

  local: Record<string, unknown>;

  limitations: Record<string, unknown>;

  votes: {
    circles: VoteTracker;

    totalWeightedApproved: number;

    totalWeightedAbstained: number;

    totalWeightedRejected: number;

    readonly collection: firebase.firestore.CollectionReference<Vote> | null;
  };

  data: Record<string, unknown>;

  state: ProposalState;

  approvalDate: firebase.firestore.Timestamp | null;

  type: ProposalsTypes;

  moderation: Moderation;
}
