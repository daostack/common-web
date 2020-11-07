import { IBaseEntity } from '../util/types';

export interface IUserEntity extends IBaseEntity {
   id: string;

   email: string;
   photoURL: string;

   firstName: string;
   lastName: string;
   displayName: string;
}