import { db } from '../../util';
import { Collections } from '../../constants';

import { addCommon } from './addCommon';
import { getCommon, getCommonTransactional } from './getCommon';
import { updateCommon } from './updateCommon';
import { deleteCommonFromDatabase } from './deleteCommon';
import { ICommonEntity } from '../types';

export const CommonsCollection = db.collection(Collections.Commons)
  .withConverter<ICommonEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): ICommonEntity {
      return snapshot.data() as ICommonEntity;
    },
    toFirestore(object: ICommonEntity | Partial<ICommonEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const commonDb = {
  add: addCommon,
  get: getCommon,
  update: updateCommon,
  delete: deleteCommonFromDatabase,

  transactional: {
    get: getCommonTransactional
  }
};
