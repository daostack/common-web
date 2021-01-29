import admin from 'firebase-admin';
import { Nullable } from './types';

export const db = admin.firestore();

export const isNullOrUndefined = (obj: Nullable<any>): boolean =>
  obj === null ||
  obj === undefined;

// ---- Reexports
export { externalRequestExecutor } from './externalRequestExecutor';
export { commonApp, commonRouter } from './commonApp';
export { addMonth } from './addMonth';
export { sleep } from './sleep';
export { poll } from './poll';
