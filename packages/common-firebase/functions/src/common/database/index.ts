import { addCommon } from './addCommon';
import { db } from '../../util';
import { Collections } from '../../constants';

// @todo Find a way to type this (looks like it is intentionally not possible?)
export const commonCollection = db.collection(Collections.Commons);

export const commonDb = {
  addCommon
};
