import { Nullable } from './types';
import { db as settingsDb } from '../settings';

export const db = settingsDb;

export const isNullOrUndefined = (obj: Nullable<any>): boolean =>
  obj === null ||
  obj === undefined;

// ---- Reexports
export { externalRequestExecutor } from './externalRequestExecutor';
export { commonApp, commonRouter } from './commonApp';
export { addMonth } from './addMonth';
export { sleep } from './sleep';
export { poll } from './poll';
