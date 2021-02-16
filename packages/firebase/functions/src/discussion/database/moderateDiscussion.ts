import { discussionCollection } from './index';

export const moderateDiscussion = async (discussionId: string, moderationEntity) => {
  const discussion = await discussionCollection
      .doc(discussionId)
      .update({
        moderation: moderationEntity,
      });

    return discussion
}