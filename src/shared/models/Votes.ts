import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

export enum VoteOutcome {
  Approved = "approved",
  Rejected = "rejected",
  Abstained = "abstained",
}

export enum VoteAction {
  Create = "create",
  Update = "update",
}

export interface Vote extends BaseEntity {
  /**
   * The id of the user who created this vote
   */
  voterId: string;

  /**
   * The outcome of this voter of this proposal
   */
  outcome: VoteOutcome;

  /**
   * The id of the common associated with the vote
   */
  commonId: string;

  /**
   * The id of the proposal associated with the vote
   */
  proposalId: string;
}

export interface VoteWithUserInfo extends Vote {
  user: User;
}

export enum VotingCardType {
  AllVotes = "Votes",
  Object = "Object",
  Support = "Support",
  Abstain = "Abstain",
}
