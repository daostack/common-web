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
let db: firebase.firestore.Firestore;

// Automatically enable Firestore persistence when Firebase is initialized
enableUnlimitedCachePersistence(); // Automatically call this function

// Function to enable Firestore persistence with unlimited cache size and error handling
function enableUnlimitedCachePersistence() {
  db = firebase.firestore(); // Initialize Firestore instance

  const settings = {
    cacheSizeBytes: CACHE_SIZE_LIMIT,
  };

  db.settings(settings);

  return db
    .enablePersistence({ synchronizeTabs: true })
    .then(() => {
      console.log("Persistence enabled successfully.");
      return;
    })
    .catch(handlePersistenceError); // Catch and handle any persistence errors
}

// Function to handle Firestore persistence errors
function handlePersistenceError(err: any) {
  console.error("Persistence error:", err); // Log the error for debugging

  if (err.code === "failed-precondition") {
    console.log("Multiple tabs open or other conflict.");
  } else if (err.code === "unimplemented") {
    console.log("Persistence is not supported in this browser.");
  } else if (
    err.name === "QuotaExceededError" ||
    err.code === "QuotaExceededError"
  ) {
    console.log("Storage quota exceeded. Consider clearing cache.");
    clearFirestoreCache(); // Clear cache and try reinitialization
  } else {
    console.error("Error enabling persistence:", err);
    reinitializeFirestoreWithPersistence(); // Reinitialize Firestore with persistence
  }
}

// Function to reinitialize Firestore with persistence after errors
function reinitializeFirestoreWithPersistence() {
  db.terminate() // Ensure Firestore is fully terminated before reinitializing
    .then(() => db.clearPersistence()) // Clear the persistence
    .then(() => {
      db = firebase.firestore(); // Reinitialize Firestore instance
      const settings = { cacheSizeBytes: CACHE_SIZE_LIMIT };
      db.settings(settings);
      return db.enablePersistence({ synchronizeTabs: true });
    })
    .then(() => {
      console.log("Persistence re-enabled.");
      return;
    })
    .catch(handlePersistenceError); // Handle any errors during reinitialization
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
      return new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
    })
    .then(() => {
      console.log("Cache cleared successfully.");
      reinitializeFirestoreWithPersistence(); // Reinitialize Firestore
      window.location.reload(); // Reload page to apply changes
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

export const isFirebaseError = (error: any): error is FirebaseError =>
  (error && error.code && error.code.startsWith("auth/")) ||
  error.name === "FirebaseError";

export const isFirestoreCacheError = (error: any): boolean =>
  isFirebaseError(error) && error.code === "unavailable";

export default firebase;
