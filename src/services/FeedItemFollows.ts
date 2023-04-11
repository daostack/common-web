import { ApiEndpoint } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { FollowFeedItemPayload } from "@/shared/interfaces/api";
import {
  Collection,
  FeedItemFollow,
  SubCollections,
  Timestamp,
} from "@/shared/models";
import { firestoreDataConverter } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api, { CancelToken } from "./Api";

const converter = firestoreDataConverter<FeedItemFollow>();

class FeedItemFollowsService {
  private getFeedItemFollowsSubCollection = (userId: string) =>
    firebase
      .firestore()
      .collection(Collection.Users)
      .doc(userId)
      .collection(SubCollections.FeedItemFollows)
      .withConverter(converter);

  public getUserFeedItemFollowData = async (
    userId: string,
    feedItemId: string,
  ): Promise<FeedItemFollow | null> => {
    const snapshot = await this.getFeedItemFollowsSubCollection(userId)
      .where("feedItemId", "==", feedItemId)
      .get();

    return snapshot.docs[0]?.data() || null;
  };

  public followFeedItem = async (
    data: FollowFeedItemPayload,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(ApiEndpoint.FollowFeedItem, data, { cancelToken });
  };

  public subscribeToNewUpdatedFollowFeedItem = (
    userId: string,
    endBefore: Timestamp,
    callback: (
      data: {
        item: FeedItemFollow;
        statuses: {
          isAdded: boolean;
          isRemoved: boolean;
        };
      }[],
    ) => void,
  ): UnsubscribeFunction => {
    const query = this.getFeedItemFollowsSubCollection(userId)
      .orderBy("lastActivity", "desc")
      .endBefore(endBefore);

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docChanges().map((docChange) => ({
        item: docChange.doc.data(),
        statuses: {
          isAdded: docChange.type === "added",
          isRemoved: docChange.type === "removed",
        },
      }));
      callback(data);
    });
  };
}

export default new FeedItemFollowsService();
