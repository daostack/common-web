import {
  ApiEndpoint,
  FirestoreDataSource,
  GovernanceActions,
  PinOrUnpinEndpointAction,
} from "@/shared/constants";
import {
  LinkStreamPayload,
  MarkCommonFeedItemAsSeenPayload,
  MarkCommonFeedItemAsUnseenPayload,
  MoveStreamPayload,
  UnsubscribeFunction,
} from "@/shared/interfaces";
import { UnlinkStreamPayload } from "@/shared/interfaces/UnlinkStreamPayload";
import {
  CirclesPermissions,
  Collection,
  CommonFeed,
  CommonFeedObjectUserUnique,
  CommonFeedType,
  CommonMember,
  FeedItemFollow,
  SubCollections,
  Timestamp,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
} from "@/shared/utils";
import firebase, { isFirestoreCacheError } from "@/shared/utils/firebase";
import Api, { CancelToken } from "./Api";
import CommonService from "./Common";
import { checkIsFeedItemDefined } from "./utils";

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
      const feedItem = snapshot?.data() || null;

      return feedItem && { ...feedItem, commonId };
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
    userId?: string,
    options: {
      startAfter?: Timestamp | null;
      feedItemId?: string;
      limit?: number;
      withoutPinnedItems?: boolean;
      source?: FirestoreDataSource;
      commonMember?: (CommonMember & CirclesPermissions) | null;
    } = {},
  ): Promise<{
    data: CommonFeed[];
    firstDocTimestamp: Timestamp | null;
    lastDocTimestamp: Timestamp | null;
    hasMore: boolean;
  }> => {
    const {
      startAfter,
      feedItemId,
      limit = 10,
      withoutPinnedItems = true,
      source = FirestoreDataSource.Default,
    } = options;
    const cached = source === FirestoreDataSource.Cache;
    const [desiredFeedItem, common, commonMember] = await Promise.all([
      feedItemId
        ? this.getCommonFeedItemById(commonId, feedItemId, cached)
        : null,
      CommonService.getCommonById(commonId, cached),
      options.commonMember ||
        (userId &&
          CommonService.getCommonMemberByUserId(commonId, userId, source)) ||
        null,
    ]);
    const pinnedFeedItems =
      (withoutPinnedItems && common?.pinnedFeedItems) || [];
    let query = this.getCommonFeedSubCollection(commonId)
      .where("isDeleted", "==", false)
      .orderBy("updatedAt", "desc");

    if (desiredFeedItem) {
      query = query.where("updatedAt", ">=", desiredFeedItem.updatedAt);
    }
    if (startAfter) {
      query = query.startAfter(startAfter);
    }
    if (!desiredFeedItem && limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get({ source });
    const feedItems = snapshot.docs.map((doc) => ({ ...doc.data(), commonId }));

    if (source === FirestoreDataSource.Cache && feedItems.length === 0) {
      return this.getCommonFeedItemsByUpdatedAt(commonId, userId, {
        ...options,
        source: FirestoreDataSource.Server,
      });
    }

    const filteredFeedItems = feedItems
      .map((item) =>
        pinnedFeedItems.some(
          (pinnedFeedItem) => pinnedFeedItem.feedObjectId === item.id,
        )
          ? null
          : item,
      )
      .filter(checkIsFeedItemDefined);
    const firstDocTimestamp = filteredFeedItems[0]?.updatedAt || null;
    const lastDocTimestamp =
      filteredFeedItems[filteredFeedItems.length - 1]?.updatedAt || null;

    return {
      data: filteredFeedItems,
      firstDocTimestamp,
      lastDocTimestamp,
      hasMore: feedItems.length === limit,
    };
  };

  public getCommonPinnedFeedItems = async (
    commonId: string,
  ): Promise<{
    data: CommonFeed[];
  }> => {
    const common = await CommonService.getCommonById(commonId);
    const pinnedItemsIds = common?.pinnedFeedItems || [];
    const pinnedFeedItems = (
      await Promise.all(
        pinnedItemsIds.map(
          async (item) =>
            await this.getCommonFeedItemById(commonId, item.feedObjectId),
        ),
      )
    ).filter(checkIsFeedItemDefined);

    return {
      data: pinnedFeedItems,
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

  public unlinkStream = async (
    payload: UnlinkStreamPayload,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(ApiEndpoint.UnlinkStream, payload, { cancelToken });
  };

  public moveStream = async (
    payload: MoveStreamPayload,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(ApiEndpoint.MoveStream, payload, { cancelToken });
  };

  public markCommonFeedItemAsUnseen = (
    payload: MarkCommonFeedItemAsUnseenPayload,
    options: { cancelToken?: CancelToken } = {},
  ) => {
    return Api.post(ApiEndpoint.MarkFeedObjectUnseenForUser, payload, options);
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


  public getFeedItemByCommonAndDiscussionId = async ({commonId, discussionId}: {commonId: string; discussionId: string}): Promise<CommonFeed | null> => {
    try {
      const feedItems = await this.getCommonFeedSubCollection(commonId)
        .where("data.id", "==", discussionId)
        .get();

      const data = feedItems.docs.map(doc => doc.data());
      return data?.[0];
    } catch (error) {
      return null;
    }
  };
}

export default new CommonFeedService();
