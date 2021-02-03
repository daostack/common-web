import { IBaseEntity } from '../util/types';
import { IUpdatableCommonEntity } from '../common/database/updateCommon';

export interface ICommonEditHistory extends IBaseEntity {
	commonId: string,
	changedBy: string,
	originalDocument: IUpdatableCommonEntity,
	newDocument: IUpdatableCommonEntity,
}
