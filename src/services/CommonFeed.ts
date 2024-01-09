import { stringify } from "query-string";
import {
  ApiEndpoint,
  GovernanceActions,
  PinOrUnpinEndpointAction,
} from "@/shared/constants";
import {
  LinkStreamPayload,
  MarkCommonFeedItemAsSeenPayload,
  MoveStreamPayload,
  UnsubscribeFunction,
} from "@/shared/interfaces";
import {
  GetFeedItemsResponse,
  GetPinnedFeedItemsResponse,
} from "@/shared/interfaces/api";
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
  convertToTimestamp,
  firestoreDataConverter,
} from "@/shared/utils";
import firebase, { isFirestoreCacheError } from "@/shared/utils/firebase";
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
    cached = false,
  ): Promise<CommonFeed | null> => {
    try {
      const snapshot = await this.getCommonFeedSubCollection(commonId)
        .doc(commonFeedId)
        .get({ source: cached ? "cache" : "default" });

      return snapshot?.data() || null;
    } catch (error) {
      if (cached && isFirestoreCacheError(error)) {
        return this.getCommonFeedItemById(commonId, commonFeedId);
      } else {
        throw error;
      }
    }
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
      feedItemId?: string;
      limit?: number;
    } = {},
  ): Promise<{
    data: CommonFeed[];
    firstDocTimestamp: Timestamp | null;
    lastDocTimestamp: Timestamp | null;
    hasMore: boolean;
  }> => {
    const { startAfter, feedItemId, limit = 10 } = options;
    const endpoint = ApiEndpoint.GetCommonFeedItems.replace(
      ":commonId",
      commonId,
    );
    const queryParams: Record<string, unknown> = {
      feedItemId,
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

  public getCommonPinnedFeedItems = async (
    commonId: string,
  ): Promise<{
    data: CommonFeed[];
  }> => {
    const endpoint = ApiEndpoint.GetCommonPinnedFeedItems.replace(
      ":commonId",
      commonId,
    );

    const { data } = await Api.get<GetPinnedFeedItemsResponse>(`${endpoint}`);
    const commonPinnedFeedItems = data.data.pinnedFeedItems.map((item) =>
      convertObjectDatesToFirestoreTimestamps<CommonFeed>(item),
    );

    return {
      data: commonPinnedFeedItems,
    };
  };

  public pinItem = async (commonId: string, feedObjectId: string) => {
    return Api.post(ApiEndpoint.CreateAction, {
      type: GovernanceActions.PIN_OR_UNPIN_FEED_ITEMS,
      args: {
        pinOrUnpin: PinOrUnpinEndpointAction.Pin,
        commonId,
        feedObjectId,
      },
    });
  };

  public unpinItem = async (commonId: string, feedObjectId: string) => {
    return Api.post(ApiEndpoint.CreateAction, {
      type: GovernanceActions.PIN_OR_UNPIN_FEED_ITEMS,
      args: {
        pinOrUnpin: PinOrUnpinEndpointAction.Unpin,
        commonId,
        feedObjectId,
      },
    });
  };

  public subscribeToNewUpdatedCommonFeedItems = (
    options: {
      commonId: string;
      endBefore?: Timestamp;
      // ids amount should be <= 10
      idsForListening?: string[];
    },
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
    const { commonId, endBefore, idsForListening } = options;
    let query = this.getCommonFeedSubCollection(commonId).orderBy(
      "updatedAt",
      "desc",
    );

    if (idsForListening && idsForListening.length > 0) {
      query = query.where("id", "in", idsForListening);
    }
    if (endBefore) {
      query = query.endBefore(endBefore);
    }

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

  public linkStream = async (
    payload: LinkStreamPayload,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(ApiEndpoint.LinkStream, payload, { cancelToken });
  };

  public moveStream = async (
    payload: MoveStreamPayload,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(ApiEndpoint.MoveStream, payload, { cancelToken });
  };

  public markCommonFeedItemAsUnseen = (
    commonId: string,
    feedObjectId: string,
  ) => {
    return Api.post(ApiEndpoint.MarkFeedObjectUnseenForUser, {
      commonId,
      feedObjectId,
    });
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
