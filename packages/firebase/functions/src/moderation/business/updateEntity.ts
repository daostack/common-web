import { discussionDb } from '../../discussion/database'
import { discussionMessageDb } from '../../discussionMessage/database'

export const updateEntity = async (itemId: string, moderationEntity, type: string) => {
  switch (type) {
    case 'discussion':
      return await discussionDb.moderateDiscussion(itemId, moderationEntity);
    case 'discussionMessage':
      return await discussionMessageDb.moderateDiscussionMessage(itemId, moderationEntity);
    case 'proposal':
      break;
    
    default:
      // code...
      break;
  }
}

