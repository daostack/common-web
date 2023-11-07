export interface SynchronizedDate {
  _seconds: number;
  _nanoseconds: number;
}

export const checkIsSynchronizedDate = (date: any): date is SynchronizedDate =>
  Boolean(date && date._seconds);
