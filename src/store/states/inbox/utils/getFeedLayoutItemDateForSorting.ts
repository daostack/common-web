import { FeedLayoutItem } from "@/pages/commonFeed";
import { checkIsFeedItemFollowLayoutItem } from "@/pages/commonFeed/components";
import { Timestamp } from "@/shared/models";

export const getFeedLayoutItemDateForSorting = (
  item: FeedLayoutItem,
): Timestamp =>
  checkIsFeedItemFollowLayoutItem(item)
    ? item.feedItem.updatedAt
    : item.chatChannel.updatedAt;
