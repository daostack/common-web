import { db } from '../../../util';
import { Collections } from '../../../constants';
import { IPayoutEntity } from '../types';
import { addPayout } from './addPayout';
import { getPayouts } from './getPayouts';
import { getPayout } from './getPayout';
import { updatePayout } from './updatePayout';

export const PayoutsCollection = db.collection(Collections.Payouts)
  .withConverter<IPayoutEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IPayoutEntity {
      return snapshot.data() as IPayoutEntity;
    },
    toFirestore(object: IPayoutEntity | Partial<IPayoutEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const payoutDb = {
  add: addPayout,
  update: updatePayout,
  get: getPayout,
  getMany: getPayouts
};