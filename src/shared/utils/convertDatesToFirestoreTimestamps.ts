import { get, set } from "lodash-es";
import { SynchronizedDate } from "@/shared/interfaces";
import { Timestamp } from "@/shared/models";
import { checkIsSynchronizedDate } from "@/shared/utils";

export const convertToTimestamp = (
  date: SynchronizedDate | Timestamp,
): Timestamp =>
  checkIsSynchronizedDate(date)
    ? new Timestamp(date._seconds, date._nanoseconds)
    : new Timestamp(date.seconds, date.nanoseconds);

const convertDateInObject = (
  data: Record<string, unknown>,
  path: string,
): void => {
  const value = get(data, path);

  if (value) {
    set(data, path, convertToTimestamp(value as SynchronizedDate));
  }
};

export const convertObjectDatesToFirestoreTimestamps = <T extends unknown>(
  data: unknown,
  paths: string[] = [],
): T => {
  if (typeof data !== "object") {
    return data as T;
  }

  const newData = { ...data };
  const allPaths = ["createdAt", "updatedAt", ...paths];

  allPaths.forEach((path) => {
    convertDateInObject(newData, path);
  });

  return newData as T;
};
