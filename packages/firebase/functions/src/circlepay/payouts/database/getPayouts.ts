import { PayoutsCollection } from './index';
import { IPayoutEntity, PayoutStatus } from '../types';

interface IGetPayoutsOptions {
  proposalId?: string;
  proposalIds?: string;

  status?: PayoutStatus | PayoutStatus[];
}

/**
 * Returns array of payouts matching all the requirements
 *
 * @param options - The options for which to retrieve payouts
 */
export const getPayouts = async (options: IGetPayoutsOptions): Promise<IPayoutEntity[]> => {
  let payoutsQuery: any = PayoutsCollection;

  if (options.proposalId) {
    payoutsQuery = payoutsQuery.where('proposalId', '==', options.proposalId);
  }

  if(options.proposalIds) {
    payoutsQuery = payoutsQuery.where('proposalIds', 'array-contains', options.proposalIds);

  }

  if (options.status) {
    if (Array.isArray(options.status)) {
      payoutsQuery = payoutsQuery.where('status', 'in', options.status);
    } else {
      payoutsQuery = payoutsQuery.where('status', '==', options.status);
    }
  }

  return (await payoutsQuery.get())
    .docs.map(x => x.data());
};