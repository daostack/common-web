import { db } from '../../util';
import { Collections } from '../../constants';

import { addCommon } from './addCommon';
import { getCommon } from './getCommon';
import { updateCommon } from './updateCommon';

// @todo Find a way to type this (looks like it is intentionally not possible?)
export const commonCollection = db.collection(Collections.Commons);

export const commonDb = {
  addCommon,
  getCommon,
  updateCommon
};
