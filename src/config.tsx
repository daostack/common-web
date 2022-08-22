import { Environment } from "@/shared/constants";
import { Configuration } from "@/shared/interfaces";
const {
  REACT_APP_ENV = Environment.Dev,
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_CLOUD_FUNCTION_URL,
  REACT_APP_DEAD_SEA_COMMON_ID,
} = process.env;

const FIREBASE_SHORT_DYNAMIC_LINKS_TEMPLATE_URL =
  "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=api_key";

if (!Object.values(Environment).includes(REACT_APP_ENV as Environment)) {
  throw new Error("App env is incorrect");
}
if (
  !REACT_APP_FIREBASE_API_KEY ||
  !REACT_APP_FIREBASE_AUTH_DOMAIN ||
  !REACT_APP_FIREBASE_DATABASE_URL ||
  !REACT_APP_FIREBASE_PROJECT_ID ||
  !REACT_APP_FIREBASE_STORAGE_BUCKET ||
  !REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
  !REACT_APP_FIREBASE_APP_ID
) {
  throw new Error("Firebase config is not fully set up");
}
if (!REACT_APP_CLOUD_FUNCTION_URL) {
  throw new Error("Cloud function URL is not set up");
}
if (!REACT_APP_DEAD_SEA_COMMON_ID) {
  throw new Error("Dead sea common id is not set up");
}

const configElement: Configuration = {
  env: REACT_APP_ENV as Environment,
  firebase: {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
  },
  cloudFunctionUrl: REACT_APP_CLOUD_FUNCTION_URL,
  deadSeaCommonId: REACT_APP_DEAD_SEA_COMMON_ID,
};

export const FIREBASE_SHORT_DYNAMIC_LINKS_URL =
  FIREBASE_SHORT_DYNAMIC_LINKS_TEMPLATE_URL.replace(
    "api_key",
    configElement.firebase.apiKey
  );

export default configElement;
