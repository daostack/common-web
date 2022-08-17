import firebase from "firebase";

interface SynchronizedDate {
  _seconds: number;
  _nanoseconds: number;
}

const convertToTimestamp = (
  date: SynchronizedDate
): firebase.firestore.Timestamp =>
  new firebase.firestore.Timestamp(date._seconds, date._nanoseconds);

const convertDateInObject = (
  data: Record<string, unknown>,
  fieldName: string
): void => {
  if (data[fieldName]) {
    data[fieldName] = convertToTimestamp(data[fieldName] as SynchronizedDate);
  }
};

export const convertObjectDatesToFirestoreTimestamps = <T extends unknown>(
  data: unknown
): T => {
  if (typeof data !== "object") {
    return data as T;
  }

  const newData = { ...data };

  convertDateInObject(newData, "createdAt");
  convertDateInObject(newData, "createTime");
  convertDateInObject(newData, "updatedAt");
  convertDateInObject(newData, "lastMessage");

  return newData as T;
};
