
import { commonDb } from '../database';
import { ICommonEntity } from '../types';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

export const updateCommon = async (common: ICommonEntity) : Promise<ICommonEntity> => {
  // should we validate here like in createCommon?
  // check if user is owner of common
  const updatedCommon = await commonDb.update(common);

  // but we need to save more data:
  // we have
  // - ownerId who initiaed the change,
  // - changed common id
  // TODO we need to record the changes
  await createEvent({
    userId: common.metadata.founderId,
    objectId: common.id,
    type: EVENT_TYPES.COMMON_UPDATED
  })

  return updatedCommon;
}