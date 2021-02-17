import { IBaseEntity } from "./helpers/IBaseEntity";

type IntentionType = 'access' | 'request';

export interface IIntentionEntity extends IBaseEntity {
  userId?: string;

  type: IntentionType;

  intention: string;
}