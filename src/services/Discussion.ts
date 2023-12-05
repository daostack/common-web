import {
  CreateDiscussionDto,
  EditDiscussionDto,
} from "@/pages/OldCommon/interfaces";
import { ApiEndpoint, FirestoreDataSource } from "@/shared/constants";
import { UnsubscribeFunction } from "@/shared/interfaces";
import { Collection, Discussion } from "@/shared/models";
import {
  convertObjectDatesToFirestoreTimestamps,
  firestoreDataConverter,
} from "@/shared/utils";
import firebase, { isFirestoreCacheError } from "@/shared/utils/firebase";
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
    source = FirestoreDataSource.Default,
  ): Promise<Discussion | null> => {
    try {
      const snapshot = await this.getDiscussionCollection()
        .doc(discussionId)
        .get({ source });
      const fromCache = snapshot.metadata.fromCache ? "local cache" : "server";
      const discussion = snapshot?.data() || null;

      console.log(
        `getDiscussionById [${fromCache}]`,
        discussionId,
        snapshot?.data() || null,
      );
      if (!discussion && source === FirestoreDataSource.Cache) {
        return this.getDiscussionById(discussionId, FirestoreDataSource.Server);
      }

      return discussion;
    } catch (error) {
      if (
        source === FirestoreDataSource.Cache &&
        isFirestoreCacheError(error)
      ) {
        return this.getDiscussionById(discussionId, FirestoreDataSource.Server);
      } else {
        throw error;
      }
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
      const source = snapshot.metadata.fromCache ? "local cache" : "server";

      if (discussion) {
        console.log(`discussion found! [${source}]`, discussionId);
        callback(discussion);
      } else {
        console.log(`discussion was not found [${source}]`, discussionId);
      }
    });
  };

  public deleteDiscussion = async (discussionId: string): Promise<void> => {
    await Api.delete(ApiEndpoint.DeleteDiscussion(discussionId));
  };
}

export default new DiscussionService();
