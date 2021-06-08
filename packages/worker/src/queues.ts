import Queue from 'bull';

const SubscriptionsQueueConst = 'Common.Subscriptions';
const NotificationsQueueConst = 'Common.Notifications';
const ProposalsQueueConst = 'Common.Proposals';
const PaymentsQueueConst = 'Common.Payments';
const PayoutsQueueConst = 'Common.Payouts';
const EventQueueConst = 'Common.Events';
const VotesQueueConst = 'Common.Votes';

export const EventQueue = Queue(EventQueueConst);
export const VotesQueue = Queue(VotesQueueConst);
export const PayoutsQueue = Queue(PayoutsQueueConst);
export const PaymentsQueue = Queue(PaymentsQueueConst);
export const ProposalsQueue = Queue(ProposalsQueueConst);
export const NotificationsQueue = Queue(NotificationsQueueConst);
export const SubscriptionsQueue = Queue(SubscriptionsQueueConst);

export const Queues = {
  EventQueue,
  VotesQueue,
  PayoutsQueue,
  PaymentsQueue,
  ProposalsQueue,
  NotificationsQueue,
  SubscriptionsQueue
};
