import { FeedItemMenuItem, GetNonAllowedItemsOptions } from "@/pages/common";

export const getNonAllowedItems: GetNonAllowedItemsOptions = () => [
  FeedItemMenuItem.Pin,
  FeedItemMenuItem.Unpin,
  FeedItemMenuItem.Edit,
  FeedItemMenuItem.Remove,
  FeedItemMenuItem.LinkTo,
];
