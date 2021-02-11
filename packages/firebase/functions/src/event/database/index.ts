import { IEventEntity } from '../types';
import { Collections } from '../../constants';
import { db } from '../../util';
import { getEvents } from './getEvents';
import { getEvent } from './getEvent';

export const EventsCollection = db.collection(Collections.Events)
  .withConverter<IEventEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IEventEntity {
      return snapshot.data() as IEventEntity;
    },
    toFirestore(object: IEventEntity | Partial<IEventEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });


export const eventsDb = {
  getMany: getEvents,
  get: getEvent
};