import { LoadingState } from "@/shared/interfaces";
import { Discussion, User } from "@/shared/models";

export interface CacheState {
  userStates: Record<string, LoadingState<User | null>>;
  discussionStates: Record<string, LoadingState<Discussion | null>>;
}
