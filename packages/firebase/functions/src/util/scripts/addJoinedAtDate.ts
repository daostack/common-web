import { commonDb } from '../../common/database';
import { ICommonEntity } from '../../common/types';
import { eventsDb } from '../../event/database';
import { EVENT_TYPES } from '../../event/event';

export const addJoinedAtDateToAllCommonMembers = async () => {
  const commons = await commonDb.getMany({});

  for(const common of commons) {
    try {
      await addJoinedAtDate(common);
    } catch(err) {
      logger.error('An error occurred while adding joined at dates', {
        error: err.message
      });
    }
  }
}

const addJoinedAtDate = async (common: ICommonEntity): Promise<void> => {
  const members = common.members;

  common['membersBackup'] = {
    ...members
  };

  for (let memberIndex in members) {
    const memberId = members[memberIndex].userId;
    if(!memberId) {
      logger.error('No member id', { common });

      return;
    }

    if (memberId === common.metadata.founderId) {
      members[memberIndex] = {
        userId: memberId,
        joinedAt: common.createdAt
      }
    } else if(!members[memberIndex].joinedAt) {
      const joinEvents = await eventsDb.getMany({
        type: EVENT_TYPES.COMMON_MEMBER_ADDED,
        userId: memberId,
        objectId: common.id
      });

      if(!joinEvents.length) {
        logger.warn('Cannot find the join event for member', {
          memberId,
          commonId: common.id,
          joinEvents
        });

        break;
      }

      members[memberIndex] = {
        userId: memberId,
        joinedAt: joinEvents[0].createdAt
      }
    }
  }

  await commonDb.update({
    id: common.id,
    members
  });
}