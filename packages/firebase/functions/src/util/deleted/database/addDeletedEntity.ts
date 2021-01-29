import admin from 'firebase-admin';
import { v4 } from 'uuid';

import { IDeletedEntity } from '../types';
import { DeletionsCollection } from './index';

import Timestamp = admin.firestore.Timestamp;

/**
 * When deleting entity you should save them to the deleted
 * collection. This is how you do it
 *
 * @param entity - The deleted entity
 * @param deletionId - ID, that can be used to track batch deletions
 */
export const addDeletedEntity = async <T>(entity: T, deletionId: string): Promise<IDeletedEntity<T>> => {
  // Created formatted representation of the passed data
  const deletedDoc: IDeletedEntity<T> = {
    id: v4(),

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

    deletionId,
    entity
  };

  // Save the deleted doc
  await DeletionsCollection
    .doc(deletedDoc.id)
    .set(deletedDoc);

  // Return the saved deleted doc
  return deletedDoc;
};