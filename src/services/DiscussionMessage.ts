import { UnsubscribeFunction } from "@/shared/interfaces";
import { Collection, DiscussionMessage } from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataList,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";

const converter = firestoreDataConverter<DiscussionMessage>();

class DiscussionMessageService {
  private getDiscussionMessageCollection = () =>
    firebase
      .firestore()
      .collection(Collection.DiscussionMessage)
      .withConverter(converter);

  public subscribeToDiscussionMessages = (
    discussionId: string,
    callback: (discussion: DiscussionMessage[]) => void,
  ): UnsubscribeFunction => {
    const query = this.getDiscussionMessageCollection().where("discussionId",'==',discussionId);

    return query.onSnapshot((snapshot) => {
      callback(transformFirebaseDataList<DiscussionMessage>(snapshot).sort(
        (m: DiscussionMessage, mP: DiscussionMessage) =>
          m.createdAt.seconds - mP.createdAt.seconds,
      ));
    });
  };
}

export default new DiscussionMessageService();
