import { firestore } from 'firebase-admin';
import { discussionCollection } from './index';
import { IDiscussionEntity } from '@common/types';

/**
 * Updating dicsussion
 * @param  discussionId 	- id of the discussion to be updated
 * @param  discussion   	- the discussion entity with the changes
 * @return 					- the discussion that was updated
 */
export const updateDiscussion = async (discussionId: string, discussion: IDiscussionEntity): Promise<IDiscussionEntity> => {
  
  const discussionDoc = {
    ...discussion,
    updatedAt: firestore.Timestamp.now(),
  }

  await discussionCollection
		.doc(discussionId)
		.update(discussionDoc);

  return discussionDoc;
}