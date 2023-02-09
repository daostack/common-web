import { LastSeenEntity } from "@/shared/constants";

export interface MarkCommonFeedItemAsSeenPayload {
  feedObjectId: string;
  commonId: string;
  lastSeenId: string;
  type: LastSeenEntity;
}
