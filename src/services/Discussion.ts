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
    const discussion = await this.getDiscussionCollection()
      .doc(discussionId)
      .get();

    return (
      (discussion && transformFirebaseDataSingle<Discussion>(discussion)) ||
      null
    );
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
      callback(transformFirebaseDataSingle<Discussion>(snapshot));
    });
  };

  public deleteDiscussion = async (discussionId: string): Promise<void> => {
    await Api.delete(ApiEndpoint.DeleteDiscussion(discussionId));
  };
}

export default new DiscussionService();
