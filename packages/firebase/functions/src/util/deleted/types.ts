import { IBaseEntity } from '../types';

export interface IDeletedEntity<T = any> extends IBaseEntity {
  deletionId: string;

  entity: T;
}
