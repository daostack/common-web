import { Collection, FeatureFlag } from "@/shared/models";
import { firestoreDataConverter } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const converter = firestoreDataConverter<FeatureFlag>();

class FeatureFlagService {
  public getUserFeatureFlags = async (
    userId: string,
  ): Promise<FeatureFlag | undefined> =>
    (
      await firebase
        .firestore()
        .collection(Collection.UserFeatureFlag)
        .withConverter(converter)
        .doc(userId)
        .get()
    ).data();
}

export default new FeatureFlagService();
