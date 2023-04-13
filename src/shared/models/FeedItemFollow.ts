import { BaseEntity } from "./BaseEntity";
import { CommonFeed, CommonFeedType } from "./CommonFeed";
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

export interface FeedItemFollowWithMetadata extends FeedItemFollow {
  feedItem: CommonFeed;
  commonName: string;
  parentCommonName?: string;
  commonAvatar: string;
}
