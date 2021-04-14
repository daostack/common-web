import { jobs } from './jobs';

import { ProposalsQueue } from './jobs/ProposalsQueue';
import { PaymentsQueue } from './jobs/PaymentsQueue';
import { EventQueue } from './jobs/EventsQueue';
import { VotesQueue } from './jobs/VotesQueue';

export const Queues = {
  ProposalsQueue,
  PaymentsQueue,
  EventQueue,
  VotesQueue
};

export const worker = jobs;
