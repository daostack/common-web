import { discussionMessageCollection } from './index';

export const moderateDiscussionMessage = async (discussionMessageId: string, moderationEntity) => {
  const discussionMessage = await discussionMessageCollection
      .doc(discussionMessageId)
      .update({
        moderation: moderationEntity,
      });
    return discussionMessage;
}