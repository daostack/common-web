import { IDiscussionEntity, IDiscussionMessage, IProposalEntity, ItemType } from '@common/types';
import { discussionDb } from '../../discussion/database';
import { discussionMessageDb } from '../../discussionMessage/database';
import { proposalDb } from '../../proposals/database';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

/**
 * Mapping each entity to the corresponsing database update function
 * @param  {string}       itemId [description]
 * @param  {ItemType}     item   [description]
 * @param  {string}       type   [description]
 * @return {Promise<any>}        [description]
 */
export const updateEntity = async (itemId: string, item: ItemType, type: string): Promise<any> => {
  let eventType = '';
  switch (type) {
    case 'discussion':
      eventType = EVENT_TYPES.DISCUSSION_REPORTED;
      await discussionDb.updateDiscussion(itemId, item as IDiscussionEntity);
      break;
    case 'discussionMessage':
      eventType = EVENT_TYPES.DISCUSSION_MESSAGE_REPORTED;
      await discussionMessageDb.updateDiscussionMessage(itemId, item as IDiscussionMessage);
      break;
    case 'proposals':
      eventType = EVENT_TYPES.PROPOSAL_REPORTED;
      await proposalDb.update(item as IProposalEntity);
      break;    
    default:
      break;
  }
  // this event creats a notification for the moderator that an item was reported
  if (item.moderation.flag === 'reported') {
    await createEvent({
      userId: item.moderation.reporter,
      objectId: itemId,
      type: eventType as EVENT_TYPES
    })
  }
}