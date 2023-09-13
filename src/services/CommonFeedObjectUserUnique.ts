import { UnsubscribeFunction } from "@/shared/interfaces";
import {
  Collection,
  CommonFeedObjectUserUnique,
  SubCollections,
} from "@/shared/models";
import { firestoreDataConverter } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const converter = firestoreDataConverter<CommonFeedObjectUserUnique>();

class CommonFeedObjectUserUniqueService {
  private getCommonFeedObjectUserUniqueSubCollection = (commonId: string) =>
    firebase
      .firestore()
      .collection(Collection.Daos)
      .doc(commonId)
      .collection(SubCollections.CommonFeedObjectUserUnique)
      .withConverter(converter);

  public getFeedItemUserMetadata = async (
    commonId: string,
    userId: string,
    feedObjectId: string,
  ): Promise<CommonFeedObjectUserUnique | null> => {
    const snapshot = await this.getCommonFeedObjectUserUniqueSubCollection(
      commonId,
    )
      .where("feedObjectId", "==", feedObjectId)
      .where("userId", "==", userId)
      .get();
    const data = snapshot.docs[0]?.data();

    return data || null;
  };

  public subscribeToFeedItemUserMetadata = (
    commonId: string,
    userId: string,
    feedObjectId: string,
    callback: (data: CommonFeedObjectUserUnique) => void,
  ): UnsubscribeFunction => {
    let query = this.getCommonFeedObjectUserUniqueSubCollection(commonId).where(
      "feedObjectId",
      "==",
      feedObjectId,
    );

    if (userId) {
      query = query.where("userId", "==", userId);
    }

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docChanges()[0]?.doc.data();

      if (data) {
        callback(data);
      }
    });
  };
}

export default new CommonFeedObjectUserUniqueService();
