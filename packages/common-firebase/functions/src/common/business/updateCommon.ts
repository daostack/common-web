
import { commonDb } from '../database';
import { ICommonUpdate, ICommonEntity } from '../types';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';
import { commonEditHistoryDb } from '../../commonEditHistory/database';

/**
 * Updating the common with the new data in commonUpdate
 * @param commonUpdate       - info of the common that needs to be updated
 * @return updatedCommon     - the common doc after the update
 */
export const updateCommon = async (commonUpdate: ICommonUpdate) : Promise<ICommonEntity> => {
  // should we validate here like in createCommon? 

  // the doc that was saved in the commonEditHistory collection
  const commonHistoryRecord = await commonEditHistoryDb.add(commonUpdate); 
  const updatedCommon = await commonDb.update(commonUpdate.newCommon);

  await createEvent({
    userId: commonHistoryRecord.changedBy,
    objectId: commonHistoryRecord.commonId,
    type: EVENT_TYPES.COMMON_UPDATED
  })

  return updatedCommon;
}