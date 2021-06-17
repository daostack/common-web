import { statisticService } from '@common/core';

import { Queues } from '../queues';


// Create new statistic type
Queues.StatisticsQueue.process('create', async (job, done) => {
  await statisticService.create(job.data.type);

  done();
});

Queues.StatisticsQueue.add('create', {
  type: 'Hourly'
}, {
  repeat: {
    cron: '0 * * * *'
  }
});

Queues.StatisticsQueue.add('create', {
  type: 'Daily'
}, {
  repeat: {
    cron: '0 0 * * *'
  }
});

Queues.StatisticsQueue.add('create', {
  type: 'Weekly'
}, {
  repeat: {
    cron: '0 0 * * 0'
  }
});
