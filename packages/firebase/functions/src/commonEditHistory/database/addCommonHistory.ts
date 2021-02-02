import { firestore } from 'firebase-admin';
import { v4 } from 'uuid';

import { commonDb } from '../../common/database';
import { commonHistoryCollection } from './index';
import { ICommonUpdate } from '../../common/types';
import { ICommonEditHistory } from '../types';

/**
 * Add a record of original and new common data to commonEditHistory collection
 * to the database
 *
 * @param commonUpdate     - info of the common that needs to be updated includeing
 *                           the new common to save and the user responsible for the changes
 */
export const addCommonHistory = async (commonUpdate: ICommonUpdate): Promise<ICommonEditHistory> => {

  const {newCommon, changedBy} = commonUpdate;
  const originalCommon = await commonDb.get(newCommon.id)

  const commonHistoryRecord: ICommonEditHistory = {
    id: v4(),
    createdAt: firestore.Timestamp.now(),
    updatedAt: firestore.Timestamp.now(),
    commonId: originalCommon.id,
    changedBy,
    originalDocument: originalCommon,
    newDocument: newCommon
  }

  await commonHistoryCollection
    .doc(originalCommon.id)
    .set(commonHistoryRecord);

  return commonHistoryRecord;
};