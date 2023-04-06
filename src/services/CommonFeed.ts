import { stringify } from "query-string";
import { ApiEndpoint } from "@/shared/constants";
import {
  MarkCommonFeedItemAsSeenPayload,
  UnsubscribeFunction,
} from "@/shared/interfaces";
import { GetFeedItemsResponse } from "@/shared/interfaces/api";
import {
  Collection,
  CommonFeed,
  CommonFeedObjectUserUnique,
  CommonFeedType,
  SubCollections,
  FirebaseTimestamp,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  convertToTimestamp,
  firestoreDataConverter,
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
      startAfter?: FirebaseTimestamp | null;
      limit?: number;
    } = {},
  ): Promise<{
    data: CommonFeed[];
    firstDocTimestamp: FirebaseTimestamp | null;
    lastDocTimestamp: FirebaseTimestamp | null;
    hasMore: boolean;
  }> => {
    const { startAfter, limit = 10 } = options;
    const endpoint = ApiEndpoint.GetCommonFeedItems.replace(
      ":commonId",
      commonId,
    );
    const queryParams: Record<string, unknown> = {
      limit,
    };

    if (startAfter) {
      queryParams.startAfter = startAfter.toDate().toISOString();
    }

    const { data } = await Api.get<GetFeedItemsResponse>(
      `${endpoint}?${stringify(queryParams)}`,
    );
    const commonFeedItems = data.data.feedItems.map((item) =>
      convertObjectDatesToFirestoreTimestamps<CommonFeed>(item),
    );
    const firstDocTimestamp =
      (data.firstDocTimestamp && convertToTimestamp(data.firstDocTimestamp)) ||
      null;
    const lastDocTimestamp =
      (data.lastDocTimestamp && convertToTimestamp(data.lastDocTimestamp)) ||
      null;

    return {
      data: commonFeedItems,
      firstDocTimestamp,
      lastDocTimestamp,
      hasMore: data.hasMore,
    };
  };

  public subscribeToNewUpdatedCommonFeedItems = (
    commonId: string,
    endBefore: FirebaseTimestamp,
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
