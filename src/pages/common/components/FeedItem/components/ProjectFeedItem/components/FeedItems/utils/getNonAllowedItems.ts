import { FeedItemMenuItem, GetNonAllowedItemsOptions } from "@/pages/common";

export const getNonAllowedItems: GetNonAllowedItemsOptions = () => [
  FeedItemMenuItem.Remove,
  FeedItemMenuItem.Unlink,
];
