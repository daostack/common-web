import { CommonFeed } from "@/shared/models";

export const checkIsFeedItemDefined = (
  item?: CommonFeed | null,
): item is CommonFeed => Boolean(item);
