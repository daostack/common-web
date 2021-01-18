import { db } from '../../util';
import { Collections } from '../../constants';
import { addCommonHistory } from './addCommonHistory';

export const commonHistoryCollection = db.collection(Collections.CommonEditHistory);

export const commonEditHistoryDb = {
  add: addCommonHistory
};
