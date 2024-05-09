import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/performance";
import "firebase/compat/storage";
import { local } from "@/config";
import { Environment, REACT_APP_ENV } from "@/shared/constants";
import config from "../../config";

interface FirebaseError extends Error {
  code: string;
}

firebase.initializeApp(config.firebase);
firebase.firestore().settings({
  experimentalForceLongPolling: true,
});

if (REACT_APP_ENV === Environment.Local) {
  firebase.auth().useEmulator(local.firebase.authDomain);
  firebase
    .firestore()
    .useEmulator(
      "localhost",
      Number(local.firebase.databaseURL.split(/:/g)[2]),
    );
} else {
  firebase
    .firestore()
    .enablePersistence({
      synchronizeTabs: true,
      experimentalForceOwningTab: false,
    })
    .catch((error) => {
      console.error("Error enabling persistence", error);
    });
}

// firebase.firestore.setLogLevel("debug");

export const isFirebaseError = (error: any): error is FirebaseError =>
  (error && error.code && error.code.startsWith("auth/")) ||
  error.name === "FirebaseError";

export const isFirestoreCacheError = (error: any): boolean =>
  isFirebaseError(error) && error.code === "unavailable";

export default firebase;
