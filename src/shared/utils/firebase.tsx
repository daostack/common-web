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

const CACHE_SIZE_LIMIT = 104857600; // 100 MB

interface FirebaseError extends Error {
  code: string;
}

const app = firebase.initializeApp(config.firebase);
let db = firebase.firestore();

// WARNING: This function is enabling local emulator. If removed, move the emulator config out of this function
enableUnlimitedCachePersistence();
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
    reinitializeFirestoreWithPersistence();
  }
}

function reinitializeFirestoreWithPersistence() {
  db = firebase.firestore(); // Reinitialize Firestore instance
  const settings = { cacheSizeBytes: CACHE_SIZE_LIMIT };
  db.settings(settings);

  db.enablePersistence({ synchronizeTabs: true })
    .then(() => {
      console.log("Persistence re-enabled.");
      return;
    })
    .catch(handlePersistenceError);
}

// Function to clear Firestore cache and re-enable persistence
export function clearFirestoreCache() {
  db.terminate()
    .then(() => {
      console.log("Firestore instance terminated.");
      return db.clearPersistence(); // Safe to clear persistence now
    })
    .then(() => {
      console.log("Persistence cleared. Waiting before reinitializing...");
      return new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 second
    })
    .then(() => {
      console.log("Cache cleared successfully.");
      reinitializeFirestoreWithPersistence(); // Reinitialize Firestore
      window.location.reload();
      return;
    })
    .catch((err) => {
      if (err.code === "failed-precondition") {
        console.log("Cannot clear persistence: Firestore is still running.");
      } else {
        console.error("Error clearing persistence cache:", err);
      }
    });
}

// Enable Firestore persistence with unlimited cache size and error handling
function enableUnlimitedCachePersistence() {
  const settings = {
    cacheSizeBytes: CACHE_SIZE_LIMIT,
  };
  db.settings(settings);
  // Enable Firestore emulator in the local environment
  if (REACT_APP_ENV === Environment.Local) {
    firebase.auth().useEmulator(local.firebase.authDomain);
    firebase
      .firestore()
      .useEmulator(
        "localhost",
        Number(local.firebase.databaseURL.split(/:/g)[2]),
      );
  }
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
