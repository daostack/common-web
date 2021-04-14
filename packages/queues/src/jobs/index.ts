import { addProposalsJob } from './ProposalsQueue';
import { addPaymentJob } from './PaymentsQueue';
import { addEventJob } from './EventsQueue';
import { addVotesJob } from './VotesQueue';

export const jobs = {
  addProposalsJob,
  addPaymentJob,
  addEventJob,
  addVotesJob
};