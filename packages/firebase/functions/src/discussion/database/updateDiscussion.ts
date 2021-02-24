import { firestore } from 'firebase-admin';
import { discussionCollection } from './index';
import { IDiscussionEntity } from '@common/types';

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