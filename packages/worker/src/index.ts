import express from 'express';
import { router, setQueues, BullAdapter } from 'bull-board';

import { logger } from '@common/core';

import './processors/VotesWorker';
import './processors/EventsWorker';
import './processors/PaymentsWorker';
import './processors/ProposalsWorker';
import './processors/NotificationsWorker';

import './events/onUserCreated';
import './events/onCommonCreated';

import { Queues } from '@common/queues';

const app = express();

setQueues(Object.values(Queues).map(queue => new BullAdapter(queue)));

app.use('/queues/dashboard', router);

app.listen(4001, () => {
  logger.info('Worker UI started on port 4001');
});
