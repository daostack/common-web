import { NewCollaborationMenuItem } from "@/shared/constants";
import { NewDiscussionCreationFormValues } from "@/shared/interfaces";
import { CommonFeed } from "@/shared/models";
import firebase from "@/shared/utils/firebase";

export interface FeedItems {
  data: CommonFeed[] | null;
  loading: boolean;
  hasMore: boolean;
  firstDocSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
  lastDocSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
}

export interface CommonState {
  feedItems: FeedItems;
  newCollaborationMenuItem: NewCollaborationMenuItem | null;
  discussionCreation: {
    data: NewDiscussionCreationFormValues | null;
    loading: boolean;
  };
}
