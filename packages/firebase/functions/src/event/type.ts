import { IBaseEntity } from '../util/types';
import { EVENT_TYPES } from './event';

export interface IEventEntity extends IBaseEntity {
  userId?: string;
  objectId?: string;

  type: EVENT_TYPES
}