import { IModerationEntity } from '@common/types'; 
import { discussionDb } from '../../discussion/database';
import { discussionMessageDb } from '../../discussionMessage/database';
import { proposalDb } from '../../proposals/database';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

export const updateEntity = async (itemId: string, moderationEntity: IModerationEntity, type: string): Promise<any> => {
  let eventType = '';
  switch (type) {
    case 'discussion':
      eventType = EVENT_TYPES.DISCUSSION_REPORTED;
      await discussionDb.moderateDiscussion(itemId, moderationEntity);
      break;
    case 'discussionMessage':
      eventType = EVENT_TYPES.DISCUSSION_MESSAGE_REPORTED;
      await discussionMessageDb.moderateDiscussionMessage(itemId, moderationEntity);
      break;
    case 'proposals':
      eventType = EVENT_TYPES.PROPOSAL_REPORTED;
      await proposalDb.moderateProposal(itemId, moderationEntity);
      break;    
    default:
      break;
  }
  if (moderationEntity.flag === 'reported') {
    await createEvent({
      userId: moderationEntity.moderator, // the reporter
      objectId: itemId,
      type: eventType as EVENT_TYPES
    })
  }
}

