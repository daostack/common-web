
/**
 * [getNewCountdown description] 
 */
export const getNewCountdown = (countdownStart: number, quietEndingPeriod: number) : number => {
	
  const now = new Date();
  const countdownHour = (new Date(countdownStart * 1000)).getHours();
  const rem = (Math.abs(now.getHours() - countdownHour)) % 24;
  
  if (rem > 0 && rem < quietEndingPeriod / 3600) {
    const newCountdown = new Date();
    newCountdown.setTime(newCountdown.getTime() + quietEndingPeriod * 1000);
    return Date.parse(newCountdown.toString()) / 1000;
  }
  return null;
}