import Queue from 'bull';

import { Queues } from '@constants';

import { IEventsQueueJob } from './definition';
import { registerCreateEventProcessor } from './jobs/createEventProcessor';

const EventsQueue = new Queue<IEventsQueueJob>(Queues.EventsQueue);

registerCreateEventProcessor(EventsQueue);

export { EventsQueue };