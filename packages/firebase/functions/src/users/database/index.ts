import { db } from '../../util';
import { Collections } from '../../constants';

import { IUserEntity } from '../types';

import { getUserByEmail } from './getUserByEmail';
import { getUser } from './getUser';

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
  getByEmail: getUserByEmail
};