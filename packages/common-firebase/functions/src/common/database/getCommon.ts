import { ICommonEntity } from '../types';
import { ArgumentError } from '../../util/errors/ArgumentError';
import { commonCollection } from './index';
import { Nullable } from '../../util/types';
import { NotFoundError } from '../../util/errors/NotFoundError';

/**
 * Gets common by id
 *
 * @param commonId - The ID of the common, that you want to find
 *
 * @throws { ArgumentError } - If the commonId param is with falsy value
 * @throws { NotFoundError } - If the common is not found
 *
 * @returns - The found common
 */
export const getCommon = async (commonId: string): Promise<ICommonEntity> => {
  if(!commonId) {
    throw new ArgumentError('commonId', commonId);
  }

  const common = (await commonCollection
    .doc(commonId)
    .get()).data() as Nullable<ICommonEntity>;

  if(!common) {
    throw new NotFoundError(commonId, 'common');
  }

  return common;
}