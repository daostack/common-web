import { firestore } from 'firebase-admin';

export interface IBaseEntity {
  /**
   * The main identifier of the common
   */
  id: string;

  /**
   * The time that the entity
   * was created
   */
  createdAt: firestore.Timestamp;

  /**
   * The last time that the entity
   * was modified
   */
  updatedAt: firestore.Timestamp;
}