import { db } from '../../index';
import { Collections } from '../../../constants';

import { addDeletedEntity } from './addDeletedEntity';
import { IDeletedEntity } from '../types';

export const DeletionsCollection = db.collection(Collections.Deleted)
  .withConverter<IDeletedEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IDeletedEntity {
      return snapshot.data() as IDeletedEntity;
    },

    toFirestore(object: IDeletedEntity | Partial<IDeletedEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const deletedDb = {
  add: addDeletedEntity
};