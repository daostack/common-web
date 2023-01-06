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
}

export default new UserService();
