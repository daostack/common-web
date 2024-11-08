import { CommonAction } from "@/shared/constants";
import {
  FeedItemFollowLayoutItem,
  NewDiscussionCreationFormValues,
  NewProposalCreationFormValues,
} from "@/shared/interfaces";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import { Circle, CommonMember, Governance, Timestamp } from "@/shared/models";

export type EntityCreation<T> = {
  data: T | null;
  loading: boolean;
};

export interface FeedItems {
  data: FeedItemFollowLayoutItem[] | null;
  loading: boolean;
  hasMore: boolean;
  firstDocTimestamp: Timestamp | null;
  lastDocTimestamp: Timestamp | null;
  batchNumber: number;
}

export interface FeedItemsPayload {
  commonId: string;
  sharedFeedItemId?: string | null;
  feedItemId?: string;
  limit?: number;
}

export interface PinnedFeedItems {
  data: FeedItemFollowLayoutItem[] | null;
  loading: boolean;
}

export interface CommonSearchState {
  isSearching: boolean;
  searchValue: string;
  feedItems: FeedItemFollowLayoutItem[] | null;
  pinnedFeedItems: FeedItemFollowLayoutItem[] | null;
}

export interface CommonState {
  feedItems: FeedItems;
  pinnedFeedItems: PinnedFeedItems;
  sharedFeedItemId: string | null;
  sharedFeedItem: FeedItemFollowLayoutItem | null;
  createdOptimisticFeedItems: Map<string, FeedItemFollowLayoutItem | undefined>;
  optimisticFeedItems: Map<string, FeedItemFollowLayoutItem>;
  optimisticDiscussionMessages: Map<string, CreateDiscussionMessageDto[]>;
  commonAction: CommonAction | null;
  discussionCreation: EntityCreation<NewDiscussionCreationFormValues>;
  proposalCreation: EntityCreation<NewProposalCreationFormValues>;
  isNewProjectCreated: boolean;
  commonMember: CommonMember | null;
  governance: Governance | null;
  recentStreamId: string;
  recentAssignedCircleByMember: Record<string, Circle>;
  searchState: CommonSearchState;
}
