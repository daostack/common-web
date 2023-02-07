import { LastSeenEntity } from "@/shared/constants/lastSeenEntity";
import { BaseEntity } from "./BaseEntity";

export interface CommonFeedObjectUserUnique extends BaseEntity {
  userId: string;
  lastSeen: {
    type: LastSeenEntity;
    id: string;
  };
  count: number;
  feedObjectId: string;
  commonId: string;
}
