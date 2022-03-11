import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

import config from "../../config";

interface FirebaseError extends Error {
  code: string;
}

firebase.initializeApp(config.firebase);

export const isFirebaseError = (error: any): error is FirebaseError => {
  return error && error.code && error.code.startsWith("auth/");
};

export default firebase;
