import { InboxItemType } from "@/shared/constants";
import { Timestamp } from "./Timestamp";

export interface InboxItem {
  itemId: string; // id of feedItemFollow or ChatChannel
  updatedAt: Timestamp;
  type: InboxItemType;
}
