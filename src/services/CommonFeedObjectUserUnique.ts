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
}

export default new CommonFeedObjectUserUniqueService();
