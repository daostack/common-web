import { IModerationEntity } from '@common/types'; 
import { discussionCollection } from './index';

export const moderateDiscussion = async (discussionId: string, moderationEntity: IModerationEntity): Promise<void> => {
  await discussionCollection
		.doc(discussionId)
		.update({
			moderation: moderationEntity,
		});
}