import { commonDb } from '../database';
import { eventsDb } from '../../event/database';

import { CommonError } from '../../util/errors';
import { EVENT_TYPES } from '../../event/event';
import { addCommonMember } from './addCommonMember';


/**
 * Refreshes the members of the common by the successful common member added events.
 * Common members differ from the count they need to be because if two members try to
 * join at the same time due to race condition one of them may be overridden
 *
 * @param commonId - The ID of the Common that we want to update the
 *  members count. For the time being the common must be one time funding
 *  type or error will be thrown
 *
 * @throws { CommonError } - If the common is not of one time
 *
 * @returns - The number of common members after the refresh
 */
export const refreshCommonMembers = async (commonId: string): Promise<number> => {
  const common = await commonDb.get(commonId);

  if (common.metadata.contributionType !== 'one-time') {
    throw new CommonError(
      'As of now you can only refresh the number of members for one-time commons'
    );
  }

  const joinEvents = await eventsDb.getMany({
    objectId: commonId,
    type: EVENT_TYPES.COMMON_MEMBER_ADDED
  });


  // Update the members of the common
  for (const event of joinEvents) {
    // eslint-disable-next-line no-await-in-loop
    await addCommonMember(common, event.userId);
  }

  // Save the updated common
  await commonDb.update(common);

  return common.members.length;
};