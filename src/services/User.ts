import { store } from "@/shared/appConfig";
import { ApiEndpoint } from "@/shared/constants";
import {
  FeedLayoutItemWithFollowData,
  UnsubscribeFunction,
} from "@/shared/interfaces";
import { UpdateUserDto } from "@/shared/interfaces/api";
import {
  Collection,
  InboxItem,
  SubCollections,
  Timestamp,
  User,
  UserMemberships,
} from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import * as cacheActions from "@/store/states/cache/actions";
import Api from "./Api";
import { addMetadataToItemsBatch, waitForUserToBeLoaded } from "./utils";

const converter = firestoreDataConverter<User>();
const inboxConverter = firestoreDataConverter<InboxItem>();
const userMembershipsConverter = firestoreDataConverter<UserMemberships>();

class UserService {
  private getUsersCollection = () =>
    firebase.firestore().collection(Collection.Users).withConverter(converter);

  private getInboxSubCollection = (userId: string) =>
    this.getUsersCollection()
      .doc(userId)
      .collection(SubCollections.Inbox)
      .withConverter(inboxConverter);

  private getUserMembershipsCollection = () =>
    firebase
      .firestore()
      .collection(Collection.UserMemberships)
      .withConverter(userMembershipsConverter);

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

  public getUsersByIds = async (ids: string[]): Promise<Array<User | null>> => {
    const queries: firebase.firestore.Query[] = [];

    // Firebase allows to use at most 10 items per query for `in` option
    for (let i = 0; i < ids.length; i += 10) {
      queries.push(
        this.getUsersCollection().where("uid", "in", ids.slice(i, i + 10)),
      );
    }

    const results = await Promise.all(queries.map((query) => query.get()));

    return results
      .map((result) => transformFirebaseDataList<User | null>(result))
      .reduce((acc, items) => [...acc, ...items], []);
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

  public getInboxItemsWithMetadata = async (options: {
    userId: string;
    startAfter?: Timestamp | null;
    limit?: number;
    unread?: boolean;
  }): Promise<{
    data: FeedLayoutItemWithFollowData[];
    firstDocTimestamp: Timestamp | null;
    lastDocTimestamp: Timestamp | null;
    hasMore: boolean;
  }> => {
    const { userId, startAfter, limit = 10, unread } = options;
    let query = this.getInboxSubCollection(userId).orderBy(
      "itemUpdatedAt",
      "desc",
    );

    if (unread) {
      query = query.where("unread", "==", true);
    }
    if (startAfter) {
      query = query.startAfter(startAfter);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    const inboxItems = snapshot.docs.map((doc) => doc.data());
    const inboxItemsWithMetadata = (
      await addMetadataToItemsBatch(
        userId,
        inboxItems.map((item) => ({
          item,
          statuses: {
            isAdded: false,
            isRemoved: false,
          },
        })),
      )
    ).map(({ item }) => item);
    const firstDocTimestamp = inboxItems[0]?.itemUpdatedAt || null;
    const lastDocTimestamp =
      inboxItems[inboxItems.length - 1]?.itemUpdatedAt || null;

    return {
      data: inboxItemsWithMetadata,
      firstDocTimestamp,
      lastDocTimestamp,
      hasMore: inboxItems.length === limit,
    };
  };

  public getInboxItems = async (options: {
    userId: string;
    startAt?: Timestamp;
    endAt?: Timestamp;
  }): Promise<InboxItem[]> => {
    const { userId, startAt, endAt } = options;
    let query = this.getInboxSubCollection(userId).orderBy(
      "itemUpdatedAt",
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

  public subscribeToNewInboxItems = (
    options: {
      userId: string;
      endBefore: Timestamp;
      unread?: boolean;
      orderBy?: "itemUpdatedAt" | "updatedAt";
    },
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
    const { userId, endBefore, unread, orderBy = "itemUpdatedAt" } = options;
    let query = this.getInboxSubCollection(userId)
      .orderBy(orderBy, "desc")
      .endBefore(endBefore);

    if (unread) {
      query = query.where("unread", "==", true);
    }

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

  public getUserMemberships = async (
    userId: string,
  ): Promise<UserMemberships | null> => {
    const snapshot = await this.getUserMembershipsCollection()
      .doc(userId)
      .get();

    return snapshot.data() || null;
  };
}

export default new UserService();
