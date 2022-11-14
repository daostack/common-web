import firebase from "./firebase";

export const getFirebaseToken = async (): Promise<string | undefined> =>
  await firebase.auth().currentUser?.getIdToken(true);
