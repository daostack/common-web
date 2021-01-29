import { ICommonEntity } from '../types';
import { commonDb } from '../database';
import { EVENT_TYPES } from '../../event/event';
import { createEvent } from '../../util/db/eventDbService';

/**
 * Removes user from the common
 *
 * @param common - The common, from witch the member will be removed
 * @param memberId - The id of the member to remove
 *
 */
export const removeCommonMember = async (common: ICommonEntity, memberId: string): Promise<void> => {
  if (!common.members.some(x => x.userId === memberId)) {
    logger.error('Trying to remove non member from common', {
      common,
      memberId
    });

    return;
  }

  logger.info('Removing common member', {
    common,
    member: memberId
  });

  // Remove the member
  common.members.splice(
    common.members.findIndex(x => x.userId === memberId),
    1
  );

  // Persist the changes
  await commonDb.update(common);

  // Create event
  await createEvent({
    userId: memberId,
    objectId: common.id,
    type: EVENT_TYPES.COMMON_MEMBER_REMOVED
  });
};
