import admin from 'firebase-admin';
import { EVENT_TYPES } from '../event';
import { IEventEntity } from '../types';
import { EventsCollection } from './index';
import { CommonError } from '../../util/errors';
import Query = admin.firestore.Query;

interface IGetEventsOptions {
  userId?: string;
  objectId?: string;

  /**
   * Get the last {number} of elements sorted
   * by createdAt date
   */
  last?: number;

  /**
   * Get the first {number} of elements sorted
   * by createdAt date
   */
  first?: number;

  /**
   * If sorting skip {number} elements
   */
  after?: number;

  type?: EVENT_TYPES;
}

/**
 * Returns array of all events matching criteria
 *
 * @param options - List of params that all of the returned events must match
 */
export const getEvents = async (options: IGetEventsOptions): Promise<IEventEntity[]> => {
  let eventsQuery: Query<IEventEntity> = EventsCollection;

  if (options.objectId) {
    eventsQuery = eventsQuery.where('objectId', '==', options.objectId);
  }

  if (options.userId) {
    eventsQuery = eventsQuery.where('userId', '==', options.userId);
  }

  if (options.type) {
    eventsQuery = eventsQuery.where('type', '==', options.type);
  }

  // Sorting and paging
  if (options.first || options.last) {
    const { first, last, after } = options;

    if (first && last) {
      throw new CommonError('Only first or only last can be selected, not both!');
    }

    if (first) {
      eventsQuery = eventsQuery
        .orderBy('createdAt', 'asc')
        .limit(first);
    }

    if (last) {
      eventsQuery = eventsQuery
        .orderBy('createdAt', 'desc')
        .limit(last);
    }

    if (after) {
      eventsQuery = eventsQuery
        .offset(after);
    }
  }

  return (await eventsQuery.get())
    .docs.map(x => x.data());
};