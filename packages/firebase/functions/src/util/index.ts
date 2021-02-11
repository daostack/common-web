import { Nullable } from './types';
import { db as settingsDb } from '../settings';
import { firestore } from 'firebase-admin';

export const db = settingsDb;

export const isNullOrUndefined = (obj: Nullable<any>): boolean =>
  obj === null ||
  obj === undefined;

export const convertTimestampToDate = <T extends Record<string, any>>(obj: T & {
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
}): T => {
  return {
    ...obj,
    createdAt: obj.createdAt.toDate(),
    updatedAt: obj.updatedAt.toDate()
  }
};

// ---- Reexports
export { externalRequestExecutor } from './externalRequestExecutor';
export { commonApp, commonRouter } from './commonApp';
export { addMonth } from './addMonth';
export { sleep } from './sleep';
export { poll } from './poll';
