import admin from 'firebase-admin';
import { EVENT_TYPES } from '../event';
import { IEventEntity } from '../types';
import { EventsCollection } from './index';

import QuerySnapshot = admin.firestore.QuerySnapshot;
import Query = admin.firestore.Query;

interface IGetEventsOptions {
  userId?: string;
  objectId?: string;

  type: EVENT_TYPES;
}

/**
 * Returns array of all events matching criteria
 *
 * @param options - List of params that all of the returned events must match
 */
export const getEvents = async (options: IGetEventsOptions): Promise<IEventEntity[]> => {
  let eventsQuery: Query<IEventEntity> = EventsCollection;
  
  if(options.objectId) {
    eventsQuery = eventsQuery.where('objectId', '==', options.objectId)
  }
    
  if(options.userId) {
    eventsQuery = eventsQuery.where('userId', '==', options.userId)
  }
    
  if(options.type) {
    eventsQuery = eventsQuery.where('type', '==', options.type)
  }

  return (await eventsQuery.get())
    .docs.map(x => x.data());
};