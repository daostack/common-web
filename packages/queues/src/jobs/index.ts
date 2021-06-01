import { addNotificationJob } from './NotificationsQueue';
import { addProposalsJob } from './ProposalsQueue';
import { addPaymentJob } from './PaymentsQueue';
import { addPayoutJob } from './PayoutsQueue';
import { addEventJob } from './EventsQueue';
import { addVotesJob } from './VotesQueue';

export const jobs = {
  addNotificationJob,
  addProposalsJob,
  addPaymentJob,
  addPayoutJob,
  addEventJob,
  addVotesJob
};