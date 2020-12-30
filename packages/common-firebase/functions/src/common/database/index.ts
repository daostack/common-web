import { db } from '../../util';
import { Collections } from '../../constants';

import { addCommon } from './addCommon';
import { getCommon } from './getCommon';
import { updateCommon } from './updateCommon';
import { deleteCommonFromDatabase } from './deleteCommon';

export const commonCollection = db.collection(Collections.Commons);

export const commonDb = {
  add: addCommon,
  get: getCommon,
  update: updateCommon,
  delete: deleteCommonFromDatabase
};
