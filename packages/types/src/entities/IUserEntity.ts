import { IBaseEntity } from './helpers/IBaseEntity';

/**
 * The main entity, representing the user
 */
export interface IUserEntity extends IBaseEntity {
   uid: string;

   email: string;
   photoURL: string;

   firstName: string;
   lastName: string;
   displayName: string;
}
