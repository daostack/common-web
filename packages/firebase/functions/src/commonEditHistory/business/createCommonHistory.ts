import { commonEditHistoryDb } from '../database';
import { ICommonEditHistory } from '../types';
import { ICommonEntity, ICommonUpdate } from '@common/types';
import { IUpdatableCommonEntity } from '../../common/database/updateCommon';

export const createCommonHistory = async (payload: ICommonUpdate, originalCommon: ICommonEntity): Promise<ICommonEditHistory> => {

  const {changes, userId} = payload;
  return commonEditHistoryDb.add(originalCommon, changes as IUpdatableCommonEntity, userId);
}
