import { FeedItemMenuItem, GetNonAllowedItemsOptions } from "@/pages/common";
import { CommonFeedType } from "@/shared/models";

export const getNonAllowedItems: GetNonAllowedItemsOptions = (type) => {
  const items: FeedItemMenuItem[] = [
    FeedItemMenuItem.Pin,
    FeedItemMenuItem.Unpin,
  ];

  if (type !== CommonFeedType.Discussion) {
    items.push(FeedItemMenuItem.Remove);
  }

  return items;
};
