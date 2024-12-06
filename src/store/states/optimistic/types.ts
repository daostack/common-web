import {
  FeedItemFollowLayoutItem
} from "@/shared/interfaces";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import { Timestamp } from "@/shared/models";

export interface OptimisticState {
  createdOptimisticFeedItems: Map<string, FeedItemFollowLayoutItem | undefined>;
  optimisticFeedItems: Map<string, FeedItemFollowLayoutItem>;
  optimisticInboxFeedItems: Map<string, FeedItemFollowLayoutItem>;
  optimisticDiscussionMessages: Map<string, CreateDiscussionMessageDto[]>;
  instantDiscussionMessagesOrder: Map<string, {
    order: number
    timestamp: Timestamp;
  }>;
}
