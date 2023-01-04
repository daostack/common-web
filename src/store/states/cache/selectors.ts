import { AppState } from "@/shared/interfaces";

export const selectUserStateById = (userId: string) => (state: AppState) =>
  state.cache.userStates[userId] || null;
