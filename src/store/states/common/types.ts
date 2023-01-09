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
  discussionCreationData: NewDiscussionCreationFormValues | null;
}
