import { firestore } from 'firebase-admin';
/**
 * In case the proposal was hidden during the quiet ending period,
 * if the proposal is getting un-hidden, we want the countdown to start from the
 * beginning of the quiet ending period, and not from the middle of it
 * @param currCountdown      - the current amount of time left to the proposal until it expires
 * @param quietEndingPeriod   - the quiet ending period of the proposal
 * @return                     - New countdown time, or null
 */
export const getNewCountdown = (currCountdown: number, quietEndingPeriod: number) : number => {
	
  const nowMillis = (firestore.Timestamp.now()).toMillis();  
  const countdownMillis = currCountdown * 1000;
  
  const diff = (countdownMillis - nowMillis) / 1000 / 60 / 60;
  
  if (diff > 0 && diff < quietEndingPeriod / 3600) 
  {
    const newCountdown = new Date();
    newCountdown.setTime(newCountdown.getTime() + quietEndingPeriod * 1000);
    return Date.parse(newCountdown.toString()) / 1000;
  }
  return null;
}