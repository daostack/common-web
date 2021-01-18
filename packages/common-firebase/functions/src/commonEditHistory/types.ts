import admin from 'firebase-admin';
import { IBaseEntity } from '../util/types';
import { ICommonEntity } from '../common/types';

export interface ICommonEditHistory extends IBaseEntity {
	commonId: string,
	changedBy: string,
	originalDocument: ICommonEntity,
	newDocument: ICommonEntity,
}