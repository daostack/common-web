import { ICommonEntity } from '@common/types';

import { db } from '../../util';
import { Collections } from '../../constants';

import { addCommon } from './addCommon';
import { getCommon, getCommonTransactional } from './getCommon';
import { getCommons } from './getCommons';
import { updateCommon } from './updateCommon';
import { deleteCommonFromDatabase } from './deleteCommon';

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
  getMany: getCommons,
  update: updateCommon,
  delete: deleteCommonFromDatabase,

  transactional: {
    get: getCommonTransactional
  }
};
