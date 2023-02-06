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
} from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api from "./Api";

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
      startAfter?: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
      limit?: number;
    } = {},
  ): Promise<{
    data: CommonFeed[];
    firstDocSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
    lastDocSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
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
    const firstDocSnapshot = snapshot.docs[0] || null;
    const lastDocSnapshot = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      data: commonFeedItems,
      firstDocSnapshot,
      lastDocSnapshot,
      hasMore: snapshot.docs.length === limit,
    };
  };

  public subscribeToNewCommonFeedItems = (
    commonId: string,
    endBefore: firebase.firestore.DocumentSnapshot<CommonFeed>,
    callback: (
      data: {
        commonFeedItem: CommonFeed;
        docSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed>;
      }[],
    ) => void,
  ): UnsubscribeFunction => {
    const query = this.getCommonFeedSubCollection(commonId)
      .orderBy("createdAt", "desc")
      .endBefore(endBefore);

    return query.onSnapshot((snapshot) => {
      const data = snapshot
        .docChanges()
        .filter((docChange) => docChange.type === "added")
        .map((docChange) => ({
          commonFeedItem: docChange.doc.data(),
          docSnapshot: docChange.doc,
        }));
      callback(data);
    });
  };

  public markCommonFeedItemAsSeen = async (
    payload: MarkCommonFeedItemAsSeenPayload,
  ): Promise<CommonFeedObjectUserUnique> => {
    const { data } = await Api.post<CommonFeedObjectUserUnique>(
      ApiEndpoint.MarkFeedObjectSeenForUser,
      payload,
    );

    return convertObjectDatesToFirestoreTimestamps(data);
  };
}

export default new CommonFeedService();
