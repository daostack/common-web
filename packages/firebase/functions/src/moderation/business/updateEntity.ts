import { discussionDb } from '../../discussion/database';
import { discussionMessageDb } from '../../discussionMessage/database';
import { proposalDb } from '../../proposals/database';

export const updateEntity = async (itemId: string, moderationEntity, type: string) => {
  switch (type) {
    case 'Discussion':
      return await discussionDb.moderateDiscussion(itemId, moderationEntity);
    case 'discussionMessage':
      return await discussionMessageDb.moderateDiscussionMessage(itemId, moderationEntity);
    case 'Proposal':
      return await proposalDb.moderateProposal(itemId, moderationEntity);
    
    default:
      // code...
      break;
  }
}

