import { discussionDb } from '../../discussion/database'

export const updateEntity = async (itemId: string, moderationEntity, type: string) => {
  switch (type) {
    case 'discussion':
      return await discussionDb.moderateDiscussion(itemId, moderationEntity);
    case 'discussionMessage':
      break;
    case 'proposal':
      break;
    
    default:
      // code...
      break;
  }
}

