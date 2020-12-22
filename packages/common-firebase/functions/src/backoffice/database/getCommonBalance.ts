import { CommonCollection } from './index';

export async function getCommonBalance():Promise<any> {
    const commonCollectionQuery: any = CommonCollection;

    return (await commonCollectionQuery.get()).docs
    .map(common => common.data());
}