import { Collection, CommonFeed, SubCollections } from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const converter = firestoreDataConverter<CommonFeed>();

class CommonFeedService {
  private getCommonFeedSubCollection = (commonId: string) =>
    firebase
      .firestore()
      .collection(Collection.Daos)
      .doc(commonId)
      .collection(SubCollections.CommonFeed)
      .withConverter(converter);

  public getCommonFeedItems = async (
    commonId: string,
    options: {
      startAfter?: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
      limit?: number;
    } = {},
  ): Promise<{
    data: CommonFeed[];
    lastDocSnapshot: firebase.firestore.DocumentSnapshot<CommonFeed> | null;
    hasMore: boolean;
  }> => {
    const { startAfter, limit = 10 } = options;
    const query = this.getCommonFeedSubCollection(commonId).orderBy(
      "createdAt",
      "desc",
    );

    if (startAfter) {
      query.startAfter(startAfter);
    }

    const snapshot = await query.limit(limit).get();
    const commonFeedItems = transformFirebaseDataList<CommonFeed>(snapshot);
    const lastDocSnapshot = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      data: commonFeedItems,
      lastDocSnapshot,
      hasMore: snapshot.docs.length === limit,
    };
  };
}

export default new CommonFeedService();
