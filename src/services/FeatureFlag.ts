import { Collection, FeatureFlag } from "@/shared/models";
import { firestoreDataConverter } from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const featureFlagsConverter = firestoreDataConverter<FeatureFlag>();

class FeatureFlagService {
  public getFeatureFlag = async (): Promise<FeatureFlag | null> =>
    (
      await firebase
        .firestore()
        .collection(Collection.FeatureFlags)
        .withConverter(featureFlagsConverter)
        .doc("feature")
        .get()
    ).data() || null;
}

export default new FeatureFlagService();
