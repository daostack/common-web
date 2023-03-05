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

  public getCommonFeedItems = async (
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
      "createdAt",
      "desc",
    );

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    const snapshot = await query.limit(limit).get();
    const commonFeedItems = transformFirebaseDataList<CommonFeed>(snapshot);
    const firstDocTimestamp = snapshot.docs[0]?.data().createdAt || null;
    const lastDocTimestamp =
      snapshot.docs[snapshot.docs.length - 1]?.data().createdAt || null;

    return {
      data: commonFeedItems,
      firstDocTimestamp,
      lastDocTimestamp,
      hasMore: snapshot.docs.length === limit,
    };
  };

  public subscribeToNewCommonFeedItems = (
    commonId: string,
    endBefore: Timestamp,
    callback: (commonFeedItems: CommonFeed[]) => void,
  ): UnsubscribeFunction => {
    const query = this.getCommonFeedSubCollection(commonId)
      .orderBy("createdAt", "desc")
      .endBefore(endBefore);

    return query.onSnapshot((snapshot) => {
      const data = snapshot
        .docChanges()
        .filter((docChange) => docChange.type === "added")
        .map((docChange) => docChange.doc.data());
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
