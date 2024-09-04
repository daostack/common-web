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
const db = firebase.firestore();

// Set Firestore settings with unlimited cache size
const settings = {
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
};
db.settings(settings);

// Function to clear Firestore cache and re-enable persistence
function clearFirestoreCache() {
  db.clearPersistence()
    .then(() => {
      console.log("Cache cleared successfully.");
      enableUnlimitedCachePersistence(); // Re-enable persistence after clearing cache
      return;
    })
    .catch((err) => {
      console.error("Error clearing persistence cache:", err);
    });
}

// Function to handle Firestore persistence errors
function handlePersistenceError(err: any) {
  if (err.code === "failed-precondition") {
    console.log("Multiple tabs open or other conflict.");
  } else if (err.code === "unimplemented") {
    console.log("Persistence is not supported in this browser.");
  } else if (err.name === "QuotaExceededError") {
    console.log("Storage quota exceeded. Consider clearing cache.");
    clearFirestoreCache();
  } else {
    console.error("Error enabling persistence:", err);
  }
}

// Enable Firestore persistence with unlimited cache size and error handling
function enableUnlimitedCachePersistence() {
  const settings = {
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  };
  db.settings(settings);

  db.enablePersistence({ synchronizeTabs: true }).catch(handlePersistenceError);
}

// Enable persistence in the local environment (with Firestore and Auth emulators)
if (REACT_APP_ENV === Environment.Local) {
  firebase.auth().useEmulator(local.firebase.authDomain);
  firebase
    .firestore()
    .useEmulator(
      "localhost",
      Number(local.firebase.databaseURL.split(/:/g)[2]),
    );
} else {
  // Enable persistence for non-local environments
  db.enablePersistence({ synchronizeTabs: true }).catch(handlePersistenceError);
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
