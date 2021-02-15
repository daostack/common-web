import { ArgumentError, NotFoundError } from '../../util/errors';
import { EventsCollection } from './index';
import { Nullable } from '../../util/types';
import { IEventEntity } from '../types';

/**
 * Gets event by id
 *
 * @param eventId - The ID of the event, that you want to find
 *
 * @throws { ArgumentError } - If the eventId param is with falsy value
 * @throws { NotFoundError } - If the event is not found
 *
 * @returns - The found event
 */
export const getEvent = async (eventId: string): Promise<IEventEntity> => {
  if (!eventId) {
    throw new ArgumentError('eventId', eventId);
  }

  const event = (await EventsCollection
    .doc(eventId)
    .get()).data() as Nullable<IEventEntity>;

  if (!event) {
    throw new NotFoundError(eventId, 'event');
  }

  return event;
};