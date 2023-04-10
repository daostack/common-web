import { UnsubscribeFunction } from "@/shared/interfaces";
import { Collection, User } from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

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
}

export default new UserService();
