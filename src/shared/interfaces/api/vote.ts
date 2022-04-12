import { VoteOutcome } from "@/shared/models";

export interface CreateVotePayload {
  proposalId: string;
  outcome: VoteOutcome;
}

export interface UpdateVotePayload {
  id: string;
  outcome: VoteOutcome;
}

export interface Vote {
    voterId: string;
    proposalId: string;
    commonId: string;
    outcome: VoteOutcome;
}
