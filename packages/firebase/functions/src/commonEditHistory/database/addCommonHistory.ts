import { firestore } from 'firebase-admin';
import { commonHistoryCollection } from './index';
import { ICommonEditHistory } from '../types';
import { ICommonEntity } from '@common/types';
import { IUpdatableCommonEntity } from '../../common/database/updateCommon';
import { v4 } from 'uuid';

/**
 * Add a record of original and new common data to commonEditHistory collection
 * to the database
 *
 * @param commonUpdate     - info of the common that needs to be updated includeing
 *                           the new common to save and the user responsible for the changes
 */
export const addCommonHistory = async (originalCommon: ICommonEntity, changes: IUpdatableCommonEntity,  userId: string): Promise<ICommonEditHistory> => {

  const commonHistoryRecordDoc: ICommonEditHistory = {
    id: v4(),
    createdAt: firestore.Timestamp.now(),
    updatedAt: firestore.Timestamp.now(),
    commonId: originalCommon.id,
    changedBy: userId,
    originalDocument: originalCommon,
    newDocument: changes as ICommonEntity,
  }

  await commonHistoryCollection
    .doc(commonHistoryRecordDoc.id)
    .set(commonHistoryRecordDoc);

  return commonHistoryRecordDoc;
};
