import { LoadingState } from "@/shared/interfaces";
import { User } from "@/shared/models";

export interface CacheState {
  userStates: Record<string, LoadingState<User | null>>;
}
