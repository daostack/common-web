import { ApiEndpoint } from "@/shared/constants";
import {
  MarkCommonFeedItemAsSeenPayload,
  UnsubscribeFunction,
} from "@/shared/interfaces";
import {
  Collection,
  CommonFeed,
  CommonFeedObjectUserUnique,
  CommonFeedType,
  SubCollections,
  Timestamp,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api, { CancelToken } from "./Api";

const converter = firestoreDataConverter<CommonFeed>();

class CommonFeedService {
  private getCommonFeedSubCollection = (commonId: string) =>
    firebase
      .firestore()
      .collection(Collection.Daos)
      .doc(commonId)
      .collection(SubCollections.CommonFeed)
      .withConverter(converter);

  public getCommonFeedItemById = async (
    commonId: string,
    commonFeedId: string,
  ): Promise<CommonFeed | null> => {
    const snapshot = await this.getCommonFeedSubCollection(commonId)
      .doc(commonFeedId)
      .get();

    return snapshot?.data() || null;
  };

  public getCommonFeedItemWithSnapshot = async (
    commonId: string,
    dataId: string,
    dataType: CommonFeedType,
  ): Promise<{
    commonFeedItem: CommonFeed;
    docSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed>;
  } | null> => {
    const snapshot = await this.getCommonFeedSubCollection(commonId)
      .where("data.id", "==", dataId)
      .where("data.type", "==", dataType)
      .get();
    const docSnapshot = snapshot.docs[0];

    if (!docSnapshot) {
      return null;
    }

    return {
      commonFeedItem: docSnapshot.data(),
      docSnapshot,
    };
  };

  public getCommonFeedItemsByUpdatedAt = async (
    commonId: string,
    options: {
      startAfter?: Timestamp | null;
      limit?: number;
    } = {},
  ): Promise<{
    data: CommonFeed[];
    firstDocTimestamp: Timestamp | null;
    lastDocTimestamp: Timestamp | null;
    hasMore: boolean;
  }> => {
    const { startAfter, limit = 10 } = options;
    let query = this.getCommonFeedSubCollection(commonId).orderBy(
      "updatedAt",
      "desc",
    );

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    const snapshot = await query.limit(limit).get();
    const commonFeedItems = transformFirebaseDataList<CommonFeed>(snapshot);
    const firstDocTimestamp = snapshot.docs[0]?.data().updatedAt || null;
    const lastDocTimestamp =
      snapshot.docs[snapshot.docs.length - 1]?.data().updatedAt || null;

    return {
      data: commonFeedItems,
      firstDocTimestamp,
      lastDocTimestamp,
      hasMore: snapshot.docs.length === limit,
    };
  };

  public subscribeToNewUpdatedCommonFeedItems = (
    commonId: string,
    endBefore: Timestamp,
    callback: (
      data: {
        commonFeedItem: CommonFeed;
        statuses: {
          isAdded: boolean;
          isRemoved: boolean;
        };
      }[],
    ) => void,
  ): UnsubscribeFunction => {
    const query = this.getCommonFeedSubCollection(commonId)
      .orderBy("updatedAt", "desc")
      .endBefore(endBefore);

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docChanges().map((docChange) => ({
        commonFeedItem: docChange.doc.data(),
        statuses: {
          isAdded: docChange.type === "added",
          isRemoved: docChange.type === "removed",
        },
      }));
      callback(data);
    });
  };

  public markCommonFeedItemAsSeen = async (
    payload: MarkCommonFeedItemAsSeenPayload,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<CommonFeedObjectUserUnique> => {
    const { cancelToken } = options;
    const { data } = await Api.post<CommonFeedObjectUserUnique>(
      ApiEndpoint.MarkFeedObjectSeenForUser,
      payload,
      { cancelToken },
    );

    return convertObjectDatesToFirestoreTimestamps(data);
  };

  public subscribeToCommonFeedItem = (
    commonId: string,
    feedItemId: string,
    callback: (item: CommonFeed, isRemoved: boolean) => void,
  ): UnsubscribeFunction => {
    const query = this.getCommonFeedSubCollection(commonId).where(
      "id",
      "==",
      feedItemId,
    );

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      if (docChange && docChange.type !== "added") {
        callback(docChange.doc.data(), docChange.type === "removed");
      }
    });
  };
}

export default new CommonFeedService();
