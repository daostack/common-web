import { Collection, UserFeatureFlags, FeatureFlag } from "@/shared/models";
import { firestoreDataConverter } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const userFeatureFlagsConverter = firestoreDataConverter<UserFeatureFlags>();
const featureFlagsConverter = firestoreDataConverter<FeatureFlag>();

class FeatureFlagService {
  public getFeatureFlag = async (
    feature: string,
  ): Promise<FeatureFlag | undefined> =>
    (
      await firebase
        .firestore()
        .collection(Collection.FeatureFlags)
        .withConverter(featureFlagsConverter)
        .doc(feature)
        .get()
    ).data();

  public getUserFeatureFlags = async (
    userId: string,
  ): Promise<UserFeatureFlags | undefined> =>
    (
      await firebase
        .firestore()
        .collection(Collection.UserFeatureFlag)
        .withConverter(userFeatureFlagsConverter)
        .doc(userId)
        .get()
    ).data();
}

export default new FeatureFlagService();
