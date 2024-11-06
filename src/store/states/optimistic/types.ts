import {
  FeedItemFollowLayoutItem
} from "@/shared/interfaces";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";

export interface OptimisticState {
  createdOptimisticFeedItems: Map<string, FeedItemFollowLayoutItem | undefined>;
  optimisticFeedItems: Map<string, FeedItemFollowLayoutItem>;
  optimisticInboxFeedItems: Map<string, FeedItemFollowLayoutItem>;
  optimisticDiscussionMessages: Map<string, CreateDiscussionMessageDto[]>;
}
