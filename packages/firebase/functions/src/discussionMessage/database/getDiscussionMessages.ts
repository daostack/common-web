import admin from 'firebase-admin';
import { discussionMessageCollection } from './index';
import { IDiscussionMessage } from '@common/types';
import QuerySnapshot = admin.firestore.QuerySnapshot;

export const getDiscussionMessages = async (discussionId: string, limit = 1, startDoc = null) : Promise<IDiscussionMessage[]> => {
    const discussionMessagesSnapshot = await getDiscussionMessagsSnapshot(discussionId, limit, startDoc);
    return discussionMessagesSnapshot
      .map(message => message.data() as IDiscussionMessage );
};

export const getDiscussionMessagsSnapshot = async (discussionId: string, limit = 1, startDoc = null) : Promise<any> => {
  let discussionMessageQuery = discussionMessageCollection
      .where('discussionId', '==', discussionId)
      .orderBy('createTime', 'desc');
      

    if (startDoc) {
      discussionMessageQuery = discussionMessageQuery.startAfter(startDoc)
    }

    return (await discussionMessageQuery
      .limit(limit)
      .get() as QuerySnapshot<IDiscussionMessage>)
      .docs;
}

