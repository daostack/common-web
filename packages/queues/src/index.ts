import { jobs } from './jobs';

import { PaymentsQueue } from './jobs/PaymentsQueue';
import { EventQueue } from './jobs/EventsQueue';
import { VotesQueue } from './jobs/VotesQueue';

export const Queues = {
  PaymentsQueue,
  EventQueue,
  VotesQueue
};

export const worker = jobs;
