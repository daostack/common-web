import { SynchronizedDate } from "@/shared/interfaces";

export const checkIsSynchronizedDate = (date: any): date is SynchronizedDate =>
  Boolean(date && date._seconds);
