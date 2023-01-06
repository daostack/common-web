import { LoadingState } from "@/shared/interfaces";
import { Discussion, Proposal, User } from "@/shared/models";

export interface CacheState {
  userStates: Record<string, LoadingState<User | null>>;
  discussionStates: Record<string, LoadingState<Discussion | null>>;
  proposalStates: Record<string, LoadingState<Proposal | null>>;
}
