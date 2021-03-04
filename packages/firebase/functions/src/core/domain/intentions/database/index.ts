import { IIntentionEntity } from '@common/types';

import { db } from '../../../../util';
import { Collections } from '../../../../constants';

import { addIntention } from './addIntention';

export const IntentionCollection = db.collection(Collections.Intentions)
  .withConverter<IIntentionEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IIntentionEntity {
      return snapshot.data() as IIntentionEntity;
    },
    toFirestore(object: IIntentionEntity | Partial<IIntentionEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const intentionDb = {
  /**
   * Add intention directly to the database
   */
  add: addIntention
};