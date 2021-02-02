import { ICommonEntity } from '@common/types';

import { IBaseEntity } from '../util/types';

export interface ICommonEditHistory extends IBaseEntity {
	commonId: string,
	changedBy: string,
	originalDocument: ICommonEntity,
	newDocument: ICommonEntity,
}