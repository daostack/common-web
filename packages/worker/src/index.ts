import express from 'express';
import { router } from 'bull-board';

import { logger } from '@common/core';

import './processors/VotesWorker';
import './processors/EventsWorker';
import './processors/PaymentsWorker';

const app = express();

app.use('/queues/dashboard', router);

app.listen(4001, () => {
  logger.info('Worker UI started on port 4001');
});
