import { Collection, Discussion } from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const converter = firestoreDataConverter<Discussion>();

class DiscussionService {
  private getDiscussionCollection = () =>
    firebase
      .firestore()
      .collection(Collection.Discussion)
      .withConverter(converter);

  public getDiscussionById = async (
    discussionId: string,
  ): Promise<Discussion | null> => {
    const discussion = await this.getDiscussionCollection()
      .doc(discussionId)
      .get();

    return (
      (discussion && transformFirebaseDataSingle<Discussion>(discussion)) ||
      null
    );
  };
}

export default new DiscussionService();
