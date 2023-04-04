import { UnsubscribeFunction } from "@/shared/interfaces";
import { Collection, DiscussionMessage } from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataList,
  convertObjectDatesToFirestoreTimestamps,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { ApiEndpoint } from "@/shared/constants";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import { Api } from ".";

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

  public createMessage = async (
    payload: CreateDiscussionMessageDto,
  ): Promise<DiscussionMessage>  => {
    const { data } = await Api.post<DiscussionMessage>(
      ApiEndpoint.CreateDiscussionMessage,
      payload,
    );
  
    return convertObjectDatesToFirestoreTimestamps(data);
  } 
}

export default new DiscussionMessageService();
