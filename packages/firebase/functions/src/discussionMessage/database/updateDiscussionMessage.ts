import { firestore } from 'firebase-admin';
import { discussionMessageCollection } from './index';
import { IDiscussionMessage } from '@common/types';

export const updateDiscussionMessage = async (discussionMessageId: string, discussionMessage: IDiscussionMessage): Promise<IDiscussionMessage> => {

  const discussionMessageEntity = {
    ...discussionMessage,
    updatedAt: firestore.Timestamp.now(),
  }
  
  await discussionMessageCollection
    .doc(discussionMessageId)
    .update(discussionMessageEntity);
    
  return discussionMessageEntity
}