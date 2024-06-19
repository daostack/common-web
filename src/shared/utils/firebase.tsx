import { getAuth, connectAuthEmulator } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/performance";
import "firebase/compat/storage";
import {
  initializeFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentSingleTabManager,
} from "firebase/firestore";
import { local } from "@/config";
import { Environment, REACT_APP_ENV } from "@/shared/constants";
import config from "../../config";

interface FirebaseError extends Error {
  code: string;
}

const firebaseApp = firebase.initializeApp(config.firebase);
const firestore = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache(
    /*settings*/ {
      tabManager: persistentSingleTabManager({
        forceOwnership: true,
      }),
    },
  ),
});

if (REACT_APP_ENV === Environment.Local) {
  const auth = getAuth();
  connectAuthEmulator(auth, local.firebase.authDomain);

  connectFirestoreEmulator(
    firestore,
    "localhost",
    Number(local.firebase.databaseURL.split(/:/g)[2]),
  );
}
// firebase.firestore.setLogLevel("debug");

export const isFirebaseError = (error: any): error is FirebaseError =>
  (error && error.code && error.code.startsWith("auth/")) ||
  error.name === "FirebaseError";

export const isFirestoreCacheError = (error: any): boolean =>
  isFirebaseError(error) && error.code === "unavailable";

export default firebase;
