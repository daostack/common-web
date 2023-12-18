import firebase from "./firebase";

export const firestoreDataConverter = <
  T,
>(): firebase.firestore.FirestoreDataConverter<T> => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snapshot) => snapshot.data() as T,
});
