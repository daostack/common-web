import { InboxItemType } from "@/shared/constants";
import { CommonFeedType } from "./CommonFeed";
import { Timestamp } from "./Timestamp";

export type InboxItemFeedItemData =
  | {
      feedItemType: CommonFeedType.Discussion;
      discussionId: string;
    }
  | {
      feedItemType: CommonFeedType.Proposal;
      proposalId: string;
      discussionId: string | null;
    }
  | {
      feedItemType: Exclude<
        CommonFeedType,
        CommonFeedType.Discussion | CommonFeedType.Proposal
      >;
    };

export type InboxItem = {
  itemId: string; // id of feedItemFollow or ChatChannel
  updatedAt: Timestamp;
} & (
  | ({
      type: InboxItemType.FeedItemFollow;
    } & InboxItemFeedItemData)
  | {
      type: InboxItemType.ChatChannel;
    }
);
