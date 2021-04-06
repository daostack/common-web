import { addPaymentJob } from './PaymentsQueue';
import { addEventJob } from './EventsQueue';
import { addVotesJob } from './VotesQueue';

export const jobs = {
  addPaymentJob,
  addEventJob,
  addVotesJob
};