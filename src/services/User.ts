import { stringify } from "query-string";
import { ApiEndpoint } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { GetInboxResponse } from "@/shared/interfaces/api";
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
import Api from "./Api";

const converter = firestoreDataConverter<User>();

class UserService {
  private getUsersCollection = () =>
    firebase.firestore().collection(Collection.Users).withConverter(converter);

  public getUserById = async (userId: string): Promise<User | null> => {
    const userSnapshot = await this.getUsersCollection()
      .where("uid", "==", userId)
      .get();

    return transformFirebaseDataList<User>(userSnapshot)[0] || null;
  };

  public subscribeToUser = (
    userId: string,
    callback: (user: User, isRemoved: boolean) => void,
  ): UnsubscribeFunction => {
    const query = this.getUsersCollection().where("uid", "==", userId);

    return query.onSnapshot((snapshot) => {
      const docChange = snapshot.docChanges()[0];

      if (docChange && docChange.type !== "added") {
        callback(docChange.doc.data(), docChange.type === "removed");
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
        convertObjectDatesToFirestoreTimestamps<ChatChannel>(item),
      ),
      feedItemFollows: data.inboxWithMetadata.feedItemFollows.map((item) =>
        convertObjectDatesToFirestoreTimestamps<FeedItemFollowWithMetadata>({
          ...item,
          feedItem: convertObjectDatesToFirestoreTimestamps<CommonFeed>(
            item.feedItem,
          ),
        }),
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
