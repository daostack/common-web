import { CommonAction } from "@/shared/constants";
import {
  FeedItemFollowLayoutItem,
  NewDiscussionCreationFormValues,
  NewProposalCreationFormValues,
} from "@/shared/interfaces";
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
  feedItems: Record<string, FeedItems>;
  pinnedFeedItems: Record<string, PinnedFeedItems>;
  sharedFeedItem: Record<string, FeedItemFollowLayoutItem | null>;
  commonAction: CommonAction | null;
  discussionCreations: Record<
    string,
    EntityCreation<NewDiscussionCreationFormValues>
  >;
  proposalCreations: Record<
    string,
    EntityCreation<NewProposalCreationFormValues>
  >;
  isNewProjectCreated: Record<string, boolean>;
  sharedFeedItemId: Record<string, string | null>;
  commonMembers: Record<string, CommonMember | null>;
  recentAssignedCircleByMember: Record<string, Record<string, Circle>>;
  governance: Record<string, Governance | null>;
  recentStreamId: string;
  pendingFeedItemId: string | null;
  searchState: Record<string, CommonSearchState>;
}
