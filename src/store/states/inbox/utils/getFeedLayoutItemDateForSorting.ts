import {
  checkIsFeedItemFollowLayoutItem,
  FeedLayoutItem,
} from "@/shared/interfaces";
import { Timestamp } from "@/shared/models";

export const getFeedLayoutItemDateForSorting = (
  item: FeedLayoutItem,
): Timestamp =>
  checkIsFeedItemFollowLayoutItem(item)
    ? item.feedItem.updatedAt
    : item.chatChannel.updatedAt;
