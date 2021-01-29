import moment from 'moment';
import admin from 'firebase-admin';

import Timestamp = admin.firestore.Timestamp;

export const addMonth = (date: Date | Timestamp): Date => {
  if(!(date instanceof Date)) {
    date = date.toDate();
  }

  return moment(date).add(1, 'months').toDate();
};