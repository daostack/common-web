import { ApiEndpoint, FirestoreDataSource } from "@/shared/constants";
import { DocChange } from "@/shared/constants/docChange";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { FollowFeedItemPayload } from "@/shared/interfaces/api";
import {
  Collection,
  FeedItemFollow,
  FeedItemFollowWithMetadata,
  SubCollections,
  Timestamp,
} from "@/shared/models";
import { firestoreDataConverter } from "@/shared/utils";
import firebase, { isFirestoreCacheError } from "@/shared/utils/firebase";
import Api, { CancelToken } from "./Api";
import CommonService from "./Common";
import CommonFeedService from "./CommonFeed";

const converter = firestoreDataConverter<FeedItemFollow>();

class FeedItemFollowsService {
  private getFeedItemFollowsSubCollection = (userId: string) =>
    firebase
      .firestore()
      .collection(Collection.Users)
      .doc(userId)
      .collection(SubCollections.FeedItemFollows)
      .withConverter(converter);

  public getFeedItemFollowDataById = async (
    userId: string,
    feedItemFollowId: string,
    source = FirestoreDataSource.Default,
  ): Promise<FeedItemFollow | null> => {
    try {
      const snapshot = await this.getFeedItemFollowsSubCollection(userId)
        .doc(feedItemFollowId)
        .get({ source });

      return snapshot?.data() || null;
    } catch (error) {
      if (
        source === FirestoreDataSource.Cache &&
        isFirestoreCacheError(error)
      ) {
        return this.getFeedItemFollowDataById(
          userId,
          feedItemFollowId,
          FirestoreDataSource.Server,
        );
      }

      throw error;
    }
  };

  public getUserFeedItemFollowData = async (
    userId: string,
    feedItemId: string,
  ): Promise<FeedItemFollow | null> => {
    const snapshot = await this.getFeedItemFollowsSubCollection(userId)
      .where("feedItemId", "==", feedItemId)
      .get();

    return snapshot.docs[0]?.data() || null;
  };

  public subscribeToUserFeedItemFollowData = (
    userId: string,
    feedItemId: string,
    callback: (
      userFeedItemFollowData: FeedItemFollow | null,
      statuses: {
        isAdded: boolean;
        isRemoved: boolean;
        isModified: boolean;
      },
    ) => void,
  ): UnsubscribeFunction => {
    const query = this.getFeedItemFollowsSubCollection(userId).where(
      "feedItemId",
      "==",
      feedItemId,
    );

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      if (docChange) {
        callback(docChange.doc.data(), {
          isAdded: docChange.type === DocChange.Added,
          isRemoved: docChange.type === DocChange.Removed,
          isModified: docChange.type === DocChange.Modified,
        });
      }
    });
  };

  public getUserFeedItemFollowDataWithMetadata = async (
    userId: string,
    feedItemId: string,
  ): Promise<FeedItemFollowWithMetadata | null> => {
    const feedItemFollowData = await this.getUserFeedItemFollowData(
      userId,
      feedItemId,
    );

    if (!feedItemFollowData) {
      return null;
    }

    const [itemCommon, feedItem] = await Promise.all([
      CommonService.getCachedCommonById(feedItemFollowData.commonId),
      CommonFeedService.getCommonFeedItemById(
        feedItemFollowData.commonId,
        feedItemFollowData.feedItemId,
      ),
    ]);

    if (!itemCommon || !feedItem) {
      return null;
    }

    const itemParentCommon = itemCommon?.directParent?.commonId
      ? await CommonService.getCachedCommonById(
          itemCommon.directParent.commonId,
        )
      : null;

    return {
      ...feedItemFollowData,
      feedItem,
      commonName: itemCommon.name,
      parentCommonName: itemParentCommon?.name,
      commonAvatar: itemCommon.image,
      listVisibility: itemCommon.listVisibility,
    };
  };

  public followFeedItem = async (
    data: FollowFeedItemPayload,
    options: { cancelToken?: CancelToken } = {},
  ): Promise<void> => {
    const { cancelToken } = options;
    await Api.post(ApiEndpoint.FollowFeedItem, data, { cancelToken });
  };

  public getFollowFeedItems = async (options: {
    userId: string;
    startAt?: Timestamp;
    endAt?: Timestamp;
  }): Promise<FeedItemFollow[]> => {
    const { userId, startAt, endAt } = options;
    let query = this.getFeedItemFollowsSubCollection(userId).orderBy(
      "lastActivity",
      "desc",
    );

    if (startAt) {
      query = query.startAt(startAt);
    }
    if (endAt) {
      query = query.endAt(endAt);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => doc.data());
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
