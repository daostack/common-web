import { LastSeenEntity } from "@/shared/constants/lastSeenEntity";
import { BaseEntity } from "./BaseEntity";
import { Timestamp } from "./Timestamp";

export interface CommonFeedObjectUserUnique extends BaseEntity {
  userId: string;
  lastSeen?: {
    type: LastSeenEntity;
    id: string;
  };
  lastSeenAt?: Timestamp;
  count: number;
  feedObjectId: string;
  commonId: string;
  seenOnce?: boolean;
  seen?: boolean;
  hasUnseenMention?: boolean;
}
