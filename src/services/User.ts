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
  Timestamp,
  User,
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  convertToTimestamp,
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { cacheActions } from "@/store/states";
import Api from "./Api";
import { waitForUserToBeLoaded } from "./utils";

const converter = firestoreDataConverter<User>();

class UserService {
  private getUsersCollection = () =>
    firebase.firestore().collection(Collection.Users).withConverter(converter);

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

  public getUserById = async (userId: string): Promise<User | null> => {
    const userSnapshot = await this.getUsersCollection()
      .where("uid", "==", userId)
      .get();

    return transformFirebaseDataList<User>(userSnapshot)[0] || null;
  };

  public getCachedUserById = async (userId: string): Promise<User | null> => {
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

  public getInboxItems = async (
    options: {
      startAfter?: Timestamp | null;
      limit?: number;
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
}

export default new UserService();
