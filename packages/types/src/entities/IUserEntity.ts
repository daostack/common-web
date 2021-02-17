import { IBaseEntity } from './helpers/IBaseEntity';
import { IPermission } from './IPermission';

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
   roles?: IPermission[];
}
