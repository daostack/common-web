import { firestore } from 'firebase-admin';
import { discussionCollection } from './index';
import WriteResult = firestore.WriteResult;

export const updateLastMessage = async (discussionId: string) : Promise<WriteResult> => {

    const discussion = await discussionCollection
      .doc(discussionId)
      .update({
        lastMessage: firestore.Timestamp.now(),
      });

    return discussion
}