import { Configuration, ConfigurationObject } from "./shared/interfaces";
const { REACT_APP_ENV = "dev" } = process.env;

const FIREBASE_SHORT_DYNAMIC_LINKS_TEMPLATE_URL =
  "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=api_key";

const dev: Configuration = {
  env: REACT_APP_ENV,
  baseApiUrl: "http://localhost:4000/api/v1/",
  firebase: {
    apiKey: "AIzaSyACs4Fof0wNmAvknR_ykBMD7SxwdxFzKKk",
    authDomain: "common-dev-dea4e.firebaseapp.com",
    databaseURL: "https://common-dev-dea4e.firebaseio.com",
    projectId: "common-dev-dea4e",
    storageBucket: "common-dev-dea4e.appspot.com",
    messagingSenderId: "1027354410661",
    appId: "1:1027354410661:web:486445886843ffcc5b974c",
  },
  cloudFunctionUrl: "https://us-central1-common-dev-dea4e.cloudfunctions.net",
};

const stage: Configuration = {
  env: REACT_APP_ENV,
  baseApiUrl: "http://localhost:4000/api/v1/",
  firebase: {
    apiKey: "AIzaSyClh8UZh-PDyVgwPrHZwURoA4HWuiXUbR8",
    authDomain: "common-staging-50741.firebaseapp.com",
    databaseURL: "https://common-staging-50741.firebaseio.com",
    projectId: "common-staging-50741",
    storageBucket: "common-staging-50741.appspot.com",
    messagingSenderId: "78965953367",
    appId: "1:78965953367:web:bc3e913a792fa28d2f6412",
  },
  cloudFunctionUrl:
    "https://us-central1-common-staging-50741.cloudfunctions.net",
};

const production: Configuration = {
  ...dev,
  firebase: {
    apiKey: "AIzaSyAml-zMhoG_amLvM8mTxrydDOYXTGuubsA",
    authDomain: "common-daostack.firebaseapp.com",
    databaseURL: "https://common-daostack.firebaseio.com",
    projectId: "common-daostack",
    storageBucket: "common-daostack.appspot.com",
    messagingSenderId: "78965953367",
    appId: "1:854172758045:android:e4b053ade246c6fb1e96f4",
  },
  cloudFunctionUrl: "https://us-central1-common-daostack.cloudfunctions.net",
};

const config: ConfigurationObject = {
  dev: stage,
  stage,
  production,
};

const configElement: Configuration = config[REACT_APP_ENV];

export const FIREBASE_SHORT_DYNAMIC_LINKS_URL = FIREBASE_SHORT_DYNAMIC_LINKS_TEMPLATE_URL.replace(
  "api_key",
  configElement.firebase.apiKey
);

export default configElement;
