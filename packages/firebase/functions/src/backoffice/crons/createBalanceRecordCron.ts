import * as functions from 'firebase-functions';
import { addCircleBalance } from '../database/addCircleBalance';



export const createBalanceRecord = functions.pubsub
  .schedule('0 0 * * SUN') // At every SUN at midnight
  .onRun(async () => {
    await addCircleBalance();
  });
