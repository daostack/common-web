import { VoteOutcome } from "@/shared/models";

export interface CreateVotePayload {
  proposalId: string;
  outcome: VoteOutcome;
}

export interface Vote {
  commonId: string;
}
