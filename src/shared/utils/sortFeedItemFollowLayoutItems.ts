import { FeedItemFollowLayoutItem } from "@/shared/interfaces";

export const sortFeedItemFollowLayoutItems = (
  data: FeedItemFollowLayoutItem[],
): void => {
  data.sort(
    (prevItem, nextItem) =>
      nextItem?.feedItem?.updatedAt.seconds -
      prevItem?.feedItem?.updatedAt.seconds,
  );
};
