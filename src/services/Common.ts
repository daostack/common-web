import { Common, SubCollections } from "@/shared/models";
import firebase from "@/shared/utils/firebase";
import Api from "./Api";

class CommonService {
  public getUserCommons = async (userId: string): Promise<Common[]> => {
    const commonsUserMemberAt = (
      await firebase
        .firestore()
        .collectionGroup(SubCollections.Members)
        .where("userId", "==", userId)
        .get()
    ).docs.map((ref) => ref.ref.path.split("/")[1]);
    console.log("commonsUserMemberAt", commonsUserMemberAt);

    return [];
  };
}

export default new CommonService();
