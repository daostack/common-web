/*global FirebaseFirestore*/
import { db } from '../../../../util';
import { Collections } from '../../../../constants';

import { IUserEntity } from '@common/types';
import { getUser } from './getUser';
import { getUsers } from './getUsers';

import { getUserByEmail } from './getUserByEmail';
import { updateUser } from './updateUser';

export const UserCollection = db.collection(Collections.Users)
  .withConverter<IUserEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IUserEntity {
      return snapshot.data() as IUserEntity;
    },
    toFirestore(object: IUserEntity | Partial<IUserEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const userDb = {
  get: getUser,
  getMany: getUsers,
  getByEmail: getUserByEmail,
  update: updateUser
};
