import { BaseEntity } from "./BaseEntity";
import { Timestamp } from "./Timestamp";

export interface ChatMessageUserStatus extends BaseEntity {
  chatChannelId: string;
  chatMessageId: string;
  userId: string;
  seen: boolean;
  seenAt: Timestamp;
}
