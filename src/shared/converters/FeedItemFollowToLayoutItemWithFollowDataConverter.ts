import { InboxItemType } from "@/shared/constants";
import { FeedItemFollowLayoutItemWithFollowData } from "@/shared/interfaces";
import { FeedItemFollowWithMetadata } from "@/shared/models";
import { Converter } from "./Converter";

class FeedItemFollowToLayoutItemWithFollowDataConverter extends Converter<
  FeedItemFollowWithMetadata,
  FeedItemFollowLayoutItemWithFollowData
> {
  public toTargetEntity = (
    feedItemFollowWithMetadata: FeedItemFollowWithMetadata,
  ): FeedItemFollowLayoutItemWithFollowData => ({
    type: InboxItemType.FeedItemFollow,
    itemId: feedItemFollowWithMetadata.feedItemId,
    feedItem: feedItemFollowWithMetadata.feedItem,
    feedItemFollowWithMetadata: feedItemFollowWithMetadata,
  });

  public toBaseEntity = (
    feedItemFollowLayoutItemWithFollowData: FeedItemFollowLayoutItemWithFollowData,
  ): FeedItemFollowWithMetadata =>
    feedItemFollowLayoutItemWithFollowData.feedItemFollowWithMetadata;
}

export default new FeedItemFollowToLayoutItemWithFollowDataConverter();
