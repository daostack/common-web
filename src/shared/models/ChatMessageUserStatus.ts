import { BaseEntity } from "./BaseEntity";
import { Timestamp } from "./Timestamp";

export interface ChatMessageUserStatus extends BaseEntity {
  chatChannelId: string;
  userId: string;
  lastSeenChatMessageId?: string;
  notSeenCount: number;
  seenOnce?: boolean;
  seenAt?: Timestamp;
}
