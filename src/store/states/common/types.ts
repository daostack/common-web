import { CommonAction } from "@/shared/constants";
import {
  NewDiscussionCreationFormValues,
  NewProposalCreationFormValues,
} from "@/shared/interfaces";
import { CommonFeed, CommonMember, Governance } from "@/shared/models";
import firebase from "@/shared/utils/firebase";

export type EntityCreation<T> = {
  data: T | null;
  loading: boolean;
};

export interface FeedItems {
  data: CommonFeed[] | null;
  loading: boolean;
  hasMore: boolean;
  firstDocSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
  lastDocSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
}

export interface CommonState {
  feedItems: FeedItems;
  commonAction: CommonAction | null;
  discussionCreation: EntityCreation<NewDiscussionCreationFormValues>;
  proposalCreation: EntityCreation<NewProposalCreationFormValues>;
  isNewProjectCreated: boolean;
  commonMember: CommonMember | null;
  governance: Governance | null;
}
