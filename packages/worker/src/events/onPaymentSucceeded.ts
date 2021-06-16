import { Event } from '@prisma/client';

import { Queues } from '../queues';

Queues.EventQueue.on('completed', async (job, result: Event) => {
  if (result.type === 'PaymentSucceeded') {
    console.log('successful payment', job.data);
  }
});