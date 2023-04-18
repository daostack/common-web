import { FeedLayoutItem } from "@/pages/commonFeed";
import { CommonAction } from "@/shared/constants";
import {
  NewDiscussionCreationFormValues,
  NewProposalCreationFormValues,
} from "@/shared/interfaces";
import { CommonMember, Governance, Timestamp } from "@/shared/models";

export type EntityCreation<T> = {
  data: T | null;
  loading: boolean;
};

export interface FeedItems {
  data: FeedLayoutItem[] | null;
  loading: boolean;
  hasMore: boolean;
  firstDocTimestamp: Timestamp | null;
  lastDocTimestamp: Timestamp | null;
}

export interface PinnedFeedItems {
  data: CommonFeed[] | null;
  loading: boolean;
}

export interface CommonState {
  feedItems: FeedItems;
  pinnedFeedItems: PinnedFeedItems;
  sharedFeedItemId: string | null;
  sharedFeedItem: FeedLayoutItem | null;
  commonAction: CommonAction | null;
  discussionCreation: EntityCreation<NewDiscussionCreationFormValues>;
  proposalCreation: EntityCreation<NewProposalCreationFormValues>;
  isNewProjectCreated: boolean;
  commonMember: CommonMember | null;
  governance: Governance | null;
  recentStreamId: string;
}
