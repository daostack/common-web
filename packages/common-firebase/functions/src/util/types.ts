import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;

export type valueOf<T> = T[keyof T];

export type Nullable<T> = T | null | undefined;

export type BaseEntityType = 'id' | 'createdAt' | 'updatedAt';

export type SharedOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export interface IBaseEntity {
  /**
   * The main identifier of the common
   */
  id: string;

  /**
   * The time that the entity
   * was created
   */
  createdAt: Timestamp;

  /**
   * The last time that the entity
   * was modified
   */
  updatedAt: Timestamp;
}