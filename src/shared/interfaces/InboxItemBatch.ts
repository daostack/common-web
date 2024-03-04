import { InboxItem } from "@/shared/models";

export interface InboxItemBatch<T = InboxItem> {
  item: T;
  statuses: {
    isAdded: boolean;
    isRemoved: boolean;
  };
}

export type InboxItemsBatch = InboxItemBatch[];
