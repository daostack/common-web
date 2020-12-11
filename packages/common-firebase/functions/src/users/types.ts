import { IBaseEntity } from '../util/types';

export interface IUserEntity extends IBaseEntity {
   uid: string;

   email: string;
   photoURL: string;

   firstName: string;
   lastName: string;
   displayName: string;
}