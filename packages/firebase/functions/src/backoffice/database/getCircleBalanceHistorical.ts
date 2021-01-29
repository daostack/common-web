import { CircleBalancesCollection } from './index';

export async function getCircleBalanceHistorical():Promise<any> {
    const circleBalancesQuery: any = CircleBalancesCollection;

    return (await circleBalancesQuery.get()).docs
    .map(balance => balance.data());
}