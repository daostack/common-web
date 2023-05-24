import { FeedItemFollowLayoutItem } from "@/pages/commonFeed";
import { CommonAction } from "@/shared/constants";
import {
  NewDiscussionCreationFormValues,
  NewProposalCreationFormValues,
  RecentAssignedCircle,
} from "@/shared/interfaces";
import { CommonMember, Governance, Timestamp } from "@/shared/models";

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
}

export interface PinnedFeedItems {
  data: FeedItemFollowLayoutItem[] | null;
  loading: boolean;
}

export interface CommonState {
  feedItems: FeedItems;
  pinnedFeedItems: PinnedFeedItems;
  sharedFeedItemId: string | null;
  sharedFeedItem: FeedItemFollowLayoutItem | null;
  commonAction: CommonAction | null;
  discussionCreation: EntityCreation<NewDiscussionCreationFormValues>;
  proposalCreation: EntityCreation<NewProposalCreationFormValues>;
  isNewProjectCreated: boolean;
  commonMember: CommonMember | null;
  governance: Governance | null;
  recentStreamId: string;
  recentAssignedCircle: RecentAssignedCircle | null;
}
