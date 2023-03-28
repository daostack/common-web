import firebase from "firebase/app";

export interface PinnedFeedItem {
  feedObjectId: string;
  pinnedAt: firebase.firestore.Timestamp;
}
