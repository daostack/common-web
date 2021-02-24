import { firestore } from 'firebase-admin';
import { discussionMessageCollection } from './index';
import { IDiscussionMessage } from '@common/types';

/**
 * Handles updating a discussion message
 * @param  discussionMessageId 		- the id of the discussion
 * @param  discussionMessage   		- the discussionMessage with the changes
 * @return The discussionMessage after the changes
 */
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