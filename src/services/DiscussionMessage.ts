import { ApiEndpoint, DocChange } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import {
  CreateDiscussionMessageDto,
  CreateDiscussionMessageReaction,
  DeleteDiscussionMessageReaction,
} from "@/shared/interfaces/api/discussionMessages";
import { Collection, DiscussionMessage, UserReaction } from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
  transformFirebaseDataList,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import { Api } from ".";

const converter = firestoreDataConverter<DiscussionMessage>();
const getUserReactionConverter = firestoreDataConverter<UserReaction>();

export const MESSAGES_NUMBER_IN_BATCH = 30;

const getDiscussionMessagesByStatus = (
  snapshot: firebase.firestore.QuerySnapshot<DiscussionMessage>,
) => {
  const added: DiscussionMessage[] = [];
  const modified: DiscussionMessage[] = [];
  const removed: DiscussionMessage[] = [];

  snapshot.docChanges().forEach((docChange) => {
    switch (docChange.type) {
      case DocChange.Added:
        added.push(transformFirebaseDataSingle(docChange.doc));
        break;
      case DocChange.Removed:
        removed.push(transformFirebaseDataSingle(docChange.doc));
        break;
      default:
        modified.push(transformFirebaseDataSingle(docChange.doc));
        break;
    }
  });

  return { added, modified, removed };
};

class DiscussionMessageService {
  private getDiscussionMessageCollection = () =>
    firebase
      .firestore()
      .collection(Collection.DiscussionMessage)
      .withConverter(converter);

  public getDiscussionMessageById = async (
    discussionMessageId: string,
  ): Promise<DiscussionMessage> => {
    const discussionMessage = await this.getDiscussionMessageCollection()
      .doc(discussionMessageId)
      .get();

    return transformFirebaseDataSingle<DiscussionMessage>(discussionMessage);
  };

  public getDiscussionMessagesByEndDate = async (
    discussionId: string,
    lastVisible: firebase.firestore.QueryDocumentSnapshot<DiscussionMessage> | null,
    endDate: Date,
  ): Promise<{
    updatedDiscussionMessages: DiscussionMessage[];
    removedDiscussionMessages: DiscussionMessage[];
    lastVisibleSnapshot: firebase.firestore.QueryDocumentSnapshot<DiscussionMessage>;
  }> => {
    const snapshot = await this.getDiscussionMessageCollection()
      .where("discussionId", "==", discussionId)
      .where("createdAt", ">=", endDate)
      .orderBy("createdAt", "desc")
      .startAfter(lastVisible)
      .get();

    const { added, removed } = getDiscussionMessagesByStatus(snapshot);
    const snapshotOfItemsAfterEndDate =
      await this.getDiscussionMessageCollection()
        .where("discussionId", "==", discussionId)
        .orderBy("createdAt", "desc")
        .startAfter(snapshot.docs[snapshot.docs.length - 1])
        .limit(5)
        .get();
    const { added: addedAfterEndDate, removed: removedAfterEndDate } =
      getDiscussionMessagesByStatus(snapshotOfItemsAfterEndDate);

    return {
      updatedDiscussionMessages: [...added, ...addedAfterEndDate],
      removedDiscussionMessages: [...removed, ...removedAfterEndDate],
      lastVisibleSnapshot:
        snapshotOfItemsAfterEndDate.docs[
          snapshotOfItemsAfterEndDate.docs.length - 1
        ],
    };
  };

  public subscribeToDiscussionMessagesByDiscussionId = (
    discussionId: string,
    lastVisible: firebase.firestore.QueryDocumentSnapshot<DiscussionMessage> | null,
    callback: (
      addedDiscussionMessages: DiscussionMessage[],
      modifiedDiscussionMessages: DiscussionMessage[],
      removedDiscussionMessages: DiscussionMessage[],
      lastVisibleDocument: firebase.firestore.QueryDocumentSnapshot<DiscussionMessage>,
    ) => void,
  ): UnsubscribeFunction => {
    let query = this.getDiscussionMessageCollection()
      .where("discussionId", "==", discussionId)
      .limit(MESSAGES_NUMBER_IN_BATCH)
      .orderBy("createdAt", "desc");

    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    return query.onSnapshot((snapshot) => {
      const { added, modified, removed } =
        getDiscussionMessagesByStatus(snapshot);

      callback(
        added,
        modified,
        removed,
        snapshot.docs[snapshot.docs.length - 1],
      );
    });
  };

  public getPreloadDiscussionMessagesByDiscussionId = async (
    discussionId: string,
  ): Promise<DiscussionMessage[]> => {
    const discussionMessages = await this.getDiscussionMessageCollection()
      .where("discussionId", "==", discussionId)
      .limit(MESSAGES_NUMBER_IN_BATCH)
      .orderBy("createdAt", "desc")
      .get();

    return transformFirebaseDataList<DiscussionMessage>(discussionMessages);
  };

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

  public createMessageReaction = async (
    payload: CreateDiscussionMessageReaction,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.CreateDiscussionMessageReaction, payload);
  };

  public deleteMessageReaction = async (
    payload: DeleteDiscussionMessageReaction,
  ): Promise<void> => {
    await Api.post(ApiEndpoint.DeleteDiscussionMessageReaction, payload);
  };

  public getUsersReactions = async (
    discussionMsgId: string,
    userId?: string,
    fetchAll?: boolean,
  ): Promise<UserReaction[] | null | undefined> => {
    const reactionsRef = firebase
      .firestore()
      .collection(Collection.DiscussionMessage)
      .doc(discussionMsgId)
      .collection(Collection.Reactions)
      .withConverter(getUserReactionConverter);

    if (fetchAll) {
      const snapshot = await reactionsRef.get();
      const reactions = snapshot.docs.map((doc) => doc.data());
      return reactions;
    }

    const doc = await reactionsRef.doc(userId).get();
    const reaction = doc.exists ? doc.data() : null;
    return reaction ? [reaction] : null;
  };
}

export default new DiscussionMessageService();
