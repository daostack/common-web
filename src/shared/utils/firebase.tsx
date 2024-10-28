import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/messaging";
import "firebase/compat/performance";
import "firebase/compat/storage";
import { getPerformance } from "firebase/performance";
import { local } from "@/config";
import { Environment, REACT_APP_ENV } from "@/shared/constants";
import config from "../../config";

interface FirebaseError extends Error {
  code: string;
}

const app = firebase.initializeApp(config.firebase);

// Enable persistence in the local environment (with Firestore and Auth emulators)
if (REACT_APP_ENV === Environment.Local) {
  firebase.auth().useEmulator(local.firebase.authDomain);
  firebase
    .firestore()
    .useEmulator(
      "localhost",
      Number(local.firebase.databaseURL.split(/:/g)[2]),
    );
}

let perf;
if (typeof window !== "undefined" && typeof window.fetch !== "undefined") {
  perf = getPerformance(app);
} else {
  perf = {
    trace: () => ({
      start: () => {},
      stop: () => {},
    }),
  };
}

export { perf };
// firebase.firestore.setLogLevel("debug");

export const isFirebaseError = (error: any): error is FirebaseError =>
  (error && error.code && error.code.startsWith("auth/")) ||
  error.name === "FirebaseError";

export const isFirestoreCacheError = (error: any): boolean =>
  isFirebaseError(error) && error.code === "unavailable";

export default firebase;
