import { commonHistoryCollection } from './index';
import { ICommonEditHistory } from '../types';

/**
 * Add a record of original and new common data to commonEditHistory collection
 * to the database
 *
 * @param commonUpdate     - info of the common that needs to be updated includeing
 *                           the new common to save and the user responsible for the changes
 */
export const addCommonHistory = async (commonId: string, commonHistoryRecord: ICommonEditHistory): Promise<ICommonEditHistory> => {

  await commonHistoryCollection
    .doc(commonId)
    .set(commonHistoryRecord);

  return commonHistoryRecord;
};
