import firebase from "./firebase";

export function transformFirebaseDataList<T>(
  data: firebase.firestore.QuerySnapshot,
) {
  return data.docs.map((d) => {
    return { id: d.id, ...d.data() };
  }) as unknown as T[];
}

export function transformFirebaseDataSingle<T>(
  data: firebase.firestore.DocumentSnapshot,
) {
  return data.data() as T;
}
