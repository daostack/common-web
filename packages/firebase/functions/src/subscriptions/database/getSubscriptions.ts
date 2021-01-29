// import { ISubscriptionEntity } from '../types';
// import { SubscriptionsCollection } from './index';
//
// interface IGetSubscriptionsOptions {
//   /**
//    * Returns the subscription, containing the paymentId
//    */
//   paymentId?: string;
// }
//
// /**
//  * Returns all subscriptions matching the chosen options
//  *
//  * @param options - The options for filtering the subscriptions
//  */
// export const getSubscription = async (options: IGetSubscriptionsOptions): Promise<ISubscriptionEntity[]> => {
//   let subscriptionsQuery: any = SubscriptionsCollection;
//
//   if (options.paymentId) {
//     subscriptionsQuery = subscriptionsQuery.where('circleFingerprint', '==', options.fingerprint);
//   }
//
//   return (await subscriptionsQuery.get()).docs
//     .map(bankAccount => bankAccount.data());
// };

