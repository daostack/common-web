import Queue from 'bull';

const SubscriptionsQueueConst = 'Common.Subscriptions';
const NotificationsQueueConst = 'Common.Notifications';
const StatisticsQueueConst = 'Common.Statistics';
const ProposalsQueueConst = 'Common.Proposals';
const PaymentsQueueConst = 'Common.Payments';
const PayoutsQueueConst = 'Common.Payouts';
const EventQueueConst = 'Common.Events';
const VotesQueueConst = 'Common.Votes';

const config = {
  redis: {
    host: process.env['REDIS_HOST'],
    port: Number(process.env['REDIS_PORT']),
    username: process.env['REDIS_USERNAME'],
    password: process.env['REDIS_PASSWORD']
  }
};

export const EventQueue = Queue(EventQueueConst, config);
export const VotesQueue = Queue(VotesQueueConst, config);
export const PayoutsQueue = Queue(PayoutsQueueConst, config);
export const PaymentsQueue = Queue(PaymentsQueueConst, config);
export const ProposalsQueue = Queue(ProposalsQueueConst, config);
export const StatisticsQueue = Queue(StatisticsQueueConst, config);
export const NotificationsQueue = Queue(NotificationsQueueConst, config);
export const SubscriptionsQueue = Queue(SubscriptionsQueueConst, config);

export const Queues = {
  EventQueue,
  VotesQueue,
  PayoutsQueue,
  PaymentsQueue,
  ProposalsQueue,
  StatisticsQueue,
  NotificationsQueue,
  SubscriptionsQueue
};
