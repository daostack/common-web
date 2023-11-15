import { ApiEndpoint } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { CreateDiscussionMessageDto } from "@/shared/interfaces/api/discussionMessages";
import { Collection, DiscussionMessage } from "@/shared/models";
import {
  firestoreDataConverter,
  transformFirebaseDataList,
  convertObjectDatesToFirestoreTimestamps,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { Api } from ".";

const converter = firestoreDataConverter<DiscussionMessage>();

class DiscussionMessageService {
  private getDiscussionMessageCollection = () =>
    firebase
      .firestore()
      .collection(Collection.DiscussionMessage)
      .withConverter(converter);

  public getDiscussionMessageById = async (discussionMessageId: string): Promise<DiscussionMessage> => {
    const discussionMessage = await this.getDiscussionMessageCollection().doc(discussionMessageId).get();

    return transformFirebaseDataSingle<DiscussionMessage>(discussionMessage);
  }

  public getDiscussionMessagesByEndDate = async (discussionId: string,lastVisible: firebase.firestore.QueryDocumentSnapshot<DiscussionMessage> | null, endDate: Date): Promise<{data: DiscussionMessage[], lastVisibleSnapshot: firebase.firestore.QueryDocumentSnapshot<DiscussionMessage>}> => {
    const snapshot = await this.getDiscussionMessageCollection().where(
      "discussionId",
      "==",
      discussionId,
    ).where("createdAt", ">=", endDate).orderBy('createdAt', 'desc').startAfter(lastVisible).get();

    const data = transformFirebaseDataList<DiscussionMessage>(snapshot);
    const snapshotOfItemsAfterEndDate = await this.getDiscussionMessageCollection().where(
      "discussionId",
      "==",
      discussionId,
    ).orderBy('createdAt', 'desc').startAfter(snapshot.docs[data.length - 1]).limit(5).get();
    const dataAfterEndDate = transformFirebaseDataList<DiscussionMessage>(snapshotOfItemsAfterEndDate);

    return {data: [...data, ...dataAfterEndDate], lastVisibleSnapshot: snapshotOfItemsAfterEndDate.docs[dataAfterEndDate.length - 1]};
  }

  public getDiscussionMessagesByDiscussionId = (discussionId: string,  lastVisible: firebase.firestore.QueryDocumentSnapshot<DiscussionMessage> | null, callback: (snapshot: firebase.firestore.QuerySnapshot<DiscussionMessage>, discussion: DiscussionMessage[]) => void,): UnsubscribeFunction => {
    let query = this.getDiscussionMessageCollection().where(
      "discussionId",
      "==",
      discussionId,
    ).limit(15).orderBy('createdAt', 'desc');

    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    return query.onSnapshot((snapshot) => {
      callback(
        snapshot,
        transformFirebaseDataList<DiscussionMessage>(snapshot),
      );
    });
  }

  public subscribeToDiscussionMessages = (
    discussionId: string,
    callback: (discussion: DiscussionMessage[]) => void,
  ): UnsubscribeFunction => {
    const query = this.getDiscussionMessageCollection().where(
      "discussionId",
      "==",
      discussionId,
    );

    return query.onSnapshot((snapshot) => {
      callback(
        transformFirebaseDataList<DiscussionMessage>(snapshot).sort(
          (m: DiscussionMessage, mP: DiscussionMessage) =>
            m.createdAt.seconds - mP.createdAt.seconds,
        ),
      );
    });
  };

  public createMessage = async (
    payload: CreateDiscussionMessageDto,
  ): Promise<DiscussionMessage> => {
    const { data } = await Api.post<DiscussionMessage>(
      ApiEndpoint.CreateDiscussionMessage,
      payload,
    );

    return convertObjectDatesToFirestoreTimestamps(data);
  };
}

export default new DiscussionMessageService();
