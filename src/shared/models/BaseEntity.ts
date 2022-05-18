import firebase from "firebase/app";

export interface BaseEntity {
  id: string;

  createdAt: firebase.firestore.Timestamp;

  updatedAt: firebase.firestore.Timestamp;
}
