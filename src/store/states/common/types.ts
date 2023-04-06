import { CommonAction } from "@/shared/constants";
import {
  NewDiscussionCreationFormValues,
  NewProposalCreationFormValues,
} from "@/shared/interfaces";
import {
  CommonFeed,
  CommonMember,
  Governance,
  FirebaseTimestamp,
} from "@/shared/models";

export type EntityCreation<T> = {
  data: T | null;
  loading: boolean;
};

export interface FeedItems {
  data: CommonFeed[] | null;
  loading: boolean;
  hasMore: boolean;
  firstDocTimestamp: FirebaseTimestamp | null;
  lastDocTimestamp: FirebaseTimestamp | null;
}

export interface CommonState {
  feedItems: FeedItems;
  sharedFeedItemId: string | null;
  sharedFeedItem: CommonFeed | null;
  commonAction: CommonAction | null;
  discussionCreation: EntityCreation<NewDiscussionCreationFormValues>;
  proposalCreation: EntityCreation<NewProposalCreationFormValues>;
  isNewProjectCreated: boolean;
  commonMember: CommonMember | null;
  governance: Governance | null;
}
