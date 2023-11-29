import { Collection, UserActivity } from "@/shared/models";
import { firestoreDataConverter } from "@/shared/utils";
import firebase, { isFirestoreCacheError } from "@/shared/utils/firebase";

const userActivityConverter = firestoreDataConverter<UserActivity>();

class UserActivityService {
  private getUsersActivityCollection = () =>
    firebase
      .firestore()
      .collection(Collection.UsersActivity)
      .withConverter(userActivityConverter);

  public getUserActivity = async (
    userId: string,
    cached = false,
  ): Promise<UserActivity | null> => {
    try {
      const snapshot = await this.getUsersActivityCollection()
        .doc(userId)
        .get({ source: cached ? "cache" : "default" });

      return snapshot?.data() || null;
    } catch (error) {
      if (cached && isFirestoreCacheError(error)) {
        return this.getUserActivity(userId);
      } else {
        throw error;
      }
    }
  };

  public updateUserActivity = async (
    userId: string,
    data: Partial<UserActivity>,
  ): Promise<void> => {
    await this.getUsersActivityCollection()
      .doc(userId)
      .set(data, { merge: true });
  };
}

export default new UserActivityService();
