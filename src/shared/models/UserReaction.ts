import { Timestamp } from "./Timestamp";

export interface UserReaction {
  createdAt?: Timestamp;
  emoji: string;
  userId: string;
}
