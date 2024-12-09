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
  transformFirebaseDataList,
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
      const discussion = snapshot?.data() || null;

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

  public getDiscussionsByIds = async (
    ids: string[],
  ): Promise<Array<Discussion | null>> => {
    const queries: firebase.firestore.Query[] = [];

    // Firebase allows to use at most 10 items per query for `in` option
    for (let i = 0; i < ids.length; i += 10) {
      queries.push(
        this.getDiscussionCollection().where("id", "in", ids.slice(i, i + 10)),
      );
    }

    const results = await Promise.all(queries.map((query) => query.get()));

    return results
      .map((result) => transformFirebaseDataList<Discussion | null>(result))
      .reduce((acc, items) => [...acc, ...items], []);
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
        // console.log(`discussion found! [${source}]`, discussionId);
        callback(discussion);
      } else {
        // console.log(`discussion was not found [${source}]`, discussionId);
      }
    });
  };

  public deleteDiscussion = async (discussionId: string): Promise<void> => {
    await Api.delete(ApiEndpoint.DeleteDiscussion(discussionId));
  };

  public getDiscussionsByCommonId = async (commonId: string) => {
    const discussionCollection = await this.getDiscussionCollection()
      .where("commonId", "==", commonId) // Query for documents where commonId matches
      .get();
  
    // Map the Firestore document data
    const data = discussionCollection.docs.map(doc => doc.data());
    return data;
  };
  
}

export default new DiscussionService();
