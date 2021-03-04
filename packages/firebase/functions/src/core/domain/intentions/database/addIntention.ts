import { v4 } from 'uuid';
import firebase from 'firebase-admin';
import firestore = firebase.firestore;

import { IIntentionEntity } from '@common/types';

import { IntentionCollection } from './index';
import { BaseEntityType } from '../../../../util/types';


export const addIntention = async (intention: Omit<IIntentionEntity, BaseEntityType>): Promise<IIntentionEntity> => {
  const intentionDoc: IIntentionEntity = {
    id: v4(),

    createdAt: firestore.Timestamp.fromDate(new Date()),
    updatedAt: firestore.Timestamp.fromDate(new Date()),

    ...intention
  };

  if (process.env.NODE_ENV === 'test') {
    intentionDoc['testCreated'] = true;
  }

  await IntentionCollection
    .doc(intentionDoc.id)
    .set(intentionDoc);

  return intentionDoc;
};