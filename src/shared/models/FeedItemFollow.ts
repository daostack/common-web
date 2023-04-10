import { BaseEntity } from "./BaseEntity";
import { CommonFeedType } from "./CommonFeed";
import { Timestamp } from "./Timestamp";

export interface FeedItemFollow extends BaseEntity {
  type: CommonFeedType;
  feedItemId: string;
  userId: string;
  emailSubscribed: boolean;
  pushSubscribed: boolean;
  commonId: string;
  lastSeen: Timestamp;
  count: number;
  lastActivity: Timestamp;
}
