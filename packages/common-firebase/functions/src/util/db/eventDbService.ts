import { v4 } from 'uuid';

import { db } from '../index';
import { Collections } from '../../constants';
import { IEventEntity } from '../../event/type';
import { BaseEntityType } from '../types';

export const eventCollection = db.collection(Collections.Event);

export const createEvent = async (doc: Omit<IEventEntity, BaseEntityType>): Promise<IEventEntity> => {
  const eventDoc: IEventEntity = {
    ...doc,
    id: v4(),

    createdAt: new Date(),
    updatedAt: new Date()
  };

  await eventCollection
    .doc(eventDoc.id)
    .set(eventDoc);

  return eventDoc;
};