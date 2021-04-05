import express from 'express';
import { router } from 'bull-board';

import { jobs } from './jobs';
import { logger } from '@common/core';

const app = express();

app.use('/queues/dashboard', router);

app.listen(4001, () => {
  logger.info('Worker UI started on port 4001');
});

export const worker = jobs;
