import firebase from "firebase/app";
import { Environment, REACT_APP_ENV } from "@/shared/constants";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

import config from "../../config";

interface FirebaseError extends Error {
  code: string;
}

firebase.initializeApp(config.firebase);

if (REACT_APP_ENV === Environment.Local) {
  firebase.auth().useEmulator("http://localhost:8086");
  firebase.firestore().useEmulator("localhost", 8080);
}

export const isFirebaseError = (error: any): error is FirebaseError => {
  return error && error.code && error.code.startsWith("auth/");
};

export default firebase;
