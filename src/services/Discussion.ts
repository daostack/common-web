import {
  CreateDiscussionDto,
  EditDiscussionDto,
} from "@/pages/OldCommon/interfaces";
import { ApiEndpoint } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { Collection, Discussion } from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
  transformFirebaseDataSingle,
} from "@/shared/utils";
import firebase from "@/shared/utils/firebase";
import Api from "./Api";

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
    try {
      const discussion = await this.getDiscussionCollection()
        .doc(discussionId)
        .get();

      return (
        (discussion && transformFirebaseDataSingle<Discussion>(discussion)) ||
        null
      );
    } catch (error) {
      if (discussionId === "7e9b9176-b091-4c94-b1f9-770c59a90556") {
        console.log("getDiscussionById error", error);
      }
      throw error;
    }
  };

  public createDiscussion = async (
    payload: CreateDiscussionDto,
  ): Promise<Discussion> => {
    const { data } = await Api.post<Discussion>(
      ApiEndpoint.CreateDiscussion,
      payload,
    );

    return convertObjectDatesToFirestoreTimestamps(data);
  };

  public editDiscussion = async (
    payload: EditDiscussionDto,
  ): Promise<Discussion> => {
    const { data } = await Api.patch<Discussion>(
      ApiEndpoint.EditDiscussion,
      payload,
    );

    return convertObjectDatesToFirestoreTimestamps(data);
  };

  public subscribeToDiscussion = (
    discussionId: string,
    callback: (discussion: Discussion) => void,
  ): UnsubscribeFunction => {
    const query = this.getDiscussionCollection().doc(discussionId);

    return query.onSnapshot((snapshot) => {
      const discussion = snapshot.data();

      if (discussion) {
        callback(discussion);
      }
    });
  };

  public deleteDiscussion = async (discussionId: string): Promise<void> => {
    await Api.delete(ApiEndpoint.DeleteDiscussion(discussionId));
  };
}

export default new DiscussionService();
