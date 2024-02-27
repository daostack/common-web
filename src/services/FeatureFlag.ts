import { Collection, UserFeatureFlags, FeatureFlag } from "@/shared/models";
import { firestoreDataConverter } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const userFeatureFlagsConverter = firestoreDataConverter<UserFeatureFlags>();
const featureFlagsConverter = firestoreDataConverter<FeatureFlag>();

class FeatureFlagService {
  public getFeatureFlag = async (
    feature: string,
  ): Promise<FeatureFlag | null> =>
    (
      await firebase
        .firestore()
        .collection(Collection.FeatureFlags)
        .withConverter(featureFlagsConverter)
        .doc(feature)
        .get()
    ).data() || null;

  public getUserFeatureFlags = async (
    userId: string,
  ): Promise<UserFeatureFlags | null> =>
    (
      await firebase
        .firestore()
        .collection(Collection.UserFeatureFlags)
        .withConverter(userFeatureFlagsConverter)
        .doc(userId)
        .get()
    ).data() || null;
}

export default new FeatureFlagService();
