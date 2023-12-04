import { stringify } from "query-string";
import { store } from "@/shared/appConfig";
import { ApiEndpoint } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { GetInboxResponse, UpdateUserDto } from "@/shared/interfaces/api";
import {
  ChatChannel,
  Collection,
  CommonFeed,
  FeedItemFollowWithMetadata,
  InboxItem,
  SubCollections,
  Timestamp,
  User,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  convertToTimestamp,
  firestoreDataConverter,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import * as cacheActions from "@/store/states/cache/actions";
import Api from "./Api";
import { waitForUserToBeLoaded } from "./utils";

const converter = firestoreDataConverter<User>();
const inboxConverter = firestoreDataConverter<InboxItem>();

class UserService {
  private getUsersCollection = () =>
    firebase.firestore().collection(Collection.Users).withConverter(converter);

  private getInboxSubCollection = (userId: string) =>
    this.getUsersCollection()
      .doc(userId)
      .collection(SubCollections.Inbox)
      .withConverter(inboxConverter);

  public updateUser = async (user: User): Promise<User> => {
    const body: UpdateUserDto = {
      userId: user.uid,
      changes: {
        email: user.email,
        photoURL: user.photoURL,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        pushNotificationPreference: user.pushNotificationPreference,
        emailNotificationPreference: user.emailNotificationPreference,
      },
    };
    const response = await Api.put<
      UpdateUserDto["changes"] | Pick<User, "uid" | "updatedAt">
    >(ApiEndpoint.UpdateUser, body);

    return {
      ...user,
      ...response.data,
    };
  };

  public getUserById = async (
    userId: string,
    cached = false,
  ): Promise<User | null> => {
    const snapshot = await this.getUsersCollection()
      .where("uid", "==", userId)
      .get({ source: cached ? "cache" : "default" });
    const users = snapshot.docs.map((doc) => doc.data());
    const user = users[0] || null;

    if (cached && !user) {
      return this.getUserById(userId);
    }

    return user;
  };

  public getCachedUserById = async (userId: string): Promise<User | null> => {
    try {
      const userState = store.getState().cache.userStates[userId];

      if (userState?.fetched) {
        return userState.data;
      }
      if (userState?.loading) {
        return await waitForUserToBeLoaded(userId);
      }

      store.dispatch(
        cacheActions.getUserStateById.request({
          payload: { userId },
        }),
      );

      return await waitForUserToBeLoaded(userId);
    } catch (err) {
      const user = await this.getUserById(userId, true);
      store.dispatch(
        cacheActions.updateUserStateById({
          userId,
          state: {
            loading: false,
            fetched: true,
            data: user,
          },
        }),
      );

      return user;
    }
  };

  public getCachedUsersById = async (userIds: string[]): Promise<User[]> =>
    (
      await Promise.allSettled(
        userIds.map((userId) => this.getCachedUserById(userId)),
      )
    )
      .map((item) => (item.status === "fulfilled" ? item.value : null))
      .filter((user): user is User => Boolean(user));

  public subscribeToUser = (
    userId: string,
    callback: (
      user: User,
      statuses: {
        isAdded: boolean;
        isRemoved: boolean;
      },
    ) => void,
  ): UnsubscribeFunction => {
    const query = this.getUsersCollection().where("uid", "==", userId);

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      if (docChange) {
        callback(docChange.doc.data(), {
          isAdded: docChange.type === "added",
          isRemoved: docChange.type === "removed",
        });
      }
    });
  };

  public getInboxItemsWithMetadata = async (
    options: {
      startAfter?: Timestamp | null;
      limit?: number;
      unread?: boolean;
    } = {},
  ): Promise<{
    data: GetInboxResponse["data"]["inboxWithMetadata"];
    firstDocTimestamp: Timestamp | null;
    lastDocTimestamp: Timestamp | null;
    hasMore: boolean;
  }> => {
    const { startAfter, limit = 10 } = options;
    const queryParams: Record<string, unknown> = {
      limit,
    };

    if (startAfter) {
      queryParams.startAfter = startAfter.toDate().toISOString();
    }

    if (options.unread) {
      queryParams.unread = true;
    }

    const {
      data: { data },
    } = await Api.get<GetInboxResponse>(
      `${ApiEndpoint.GetInbox}?${stringify(queryParams)}`,
    );
    const inboxItems: GetInboxResponse["data"]["inboxWithMetadata"] = {
      chatChannels: data.inboxWithMetadata.chatChannels.map((item) =>
        convertObjectDatesToFirestoreTimestamps<ChatChannel>(item, [
          "lastMessage.createdAt",
        ]),
      ),
      feedItemFollows: data.inboxWithMetadata.feedItemFollows.map((item) =>
        convertObjectDatesToFirestoreTimestamps<FeedItemFollowWithMetadata>(
          {
            ...item,
            feedItem: convertObjectDatesToFirestoreTimestamps<CommonFeed>(
              item.feedItem,
            ),
          },
          ["lastSeen", "lastActivity"],
        ),
      ),
    };
    const firstDocTimestamp =
      (data.firstDocTimestamp && convertToTimestamp(data.firstDocTimestamp)) ||
      null;
    const lastDocTimestamp =
      (data.lastDocTimestamp && convertToTimestamp(data.lastDocTimestamp)) ||
      null;

    return {
      data: inboxItems,
      firstDocTimestamp,
      lastDocTimestamp,
      hasMore: data.hasMore,
    };
  };

  public getInboxItems = async (options: {
    userId: string;
    startAt?: Timestamp;
    endAt?: Timestamp;
  }): Promise<InboxItem[]> => {
    const { userId, startAt, endAt } = options;
    let query = this.getInboxSubCollection(userId).orderBy("updatedAt", "desc");

    if (startAt) {
      query = query.startAt(startAt);
    }
    if (endAt) {
      query = query.endAt(endAt);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => doc.data());
  };

  public subscribeToNewInboxItems = (
    userId: string,
    endBefore: Timestamp,
    callback: (
      data: {
        item: InboxItem;
        statuses: {
          isAdded: boolean;
          isRemoved: boolean;
        };
      }[],
    ) => void,
  ): UnsubscribeFunction => {
    const query = this.getInboxSubCollection(userId)
      .orderBy("updatedAt", "desc")
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

export default new UserService();
