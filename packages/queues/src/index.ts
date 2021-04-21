import { jobs } from './jobs';

import { NotificationQueue } from './jobs/NotificationsQueue';
import { ProposalsQueue } from './jobs/ProposalsQueue';
import { PaymentsQueue } from './jobs/PaymentsQueue';
import { EventQueue } from './jobs/EventsQueue';
import { VotesQueue } from './jobs/VotesQueue';

export const Queues = {
  NotificationQueue,
  ProposalsQueue,
  PaymentsQueue,
  EventQueue,
  VotesQueue
};

export const worker = jobs;
