import { addNotificationJob } from './NotificationsQueue';
import { addProposalsJob } from './ProposalsQueue';
import { addPaymentJob } from './PaymentsQueue';
import { addEventJob } from './EventsQueue';
import { addVotesJob } from './VotesQueue';

export const jobs = {
  addNotificationJob,
  addProposalsJob,
  addPaymentJob,
  addEventJob,
  addVotesJob
};