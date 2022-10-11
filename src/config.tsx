import { Environment, REACT_APP_ENV } from "./shared/constants";
import { Configuration, ConfigurationObject } from "./shared/interfaces";

const FIREBASE_SHORT_DYNAMIC_LINKS_TEMPLATE_URL =
  "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=api_key";

if (!Object.values(Environment).includes(REACT_APP_ENV)) {
  throw new Error(
    `REACT_APP_ENV has invalid value "${REACT_APP_ENV}". Allowed values: "${Object.values(
      Environment
    ).join(", ")}"`
  );
}

export const local: Configuration = {
  env: Environment.Local,
  firebase: {
    apiKey: "AIzaSyACs4Fof0wNmAvknR_ykBMD7SxwdxFzKKk",
    authDomain: "http://localhost:8086",
    databaseURL: "http://localhost:8080",
    projectId: "common-dev-dea4e",
    storageBucket: "common-dev-dea4e.appspot.com",
    messagingSenderId: "1027354410661",
    appId: "1:1027354410661:web:486445886843ffcc5b974c",
  },
  cloudFunctionUrl: "http://localhost:5003/common-dev-dea4e/us-central1",
  deadSeaCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
  parentsForClimateCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
};

const dev: Configuration = {
  env: Environment.Dev,
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
  deadSeaCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
  parentsForClimateCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
};

const stage: Configuration = {
  env: Environment.Stage,
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
  deadSeaCommonId: "a55a1e9b-104a-4866-9f4f-3e017bbae281",
  parentsForClimateCommonId: "a55a1e9b-104a-4866-9f4f-3e017bbae281",
};

const production: Configuration = {
  env: Environment.Production,
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
  deadSeaCommonId: "e5546b0d-52ef-44da-9a7d-f1104d869880",
  parentsForClimateCommonId: "04ac2ec2-5cb2-4ab9-ae3f-5f223f482768",
};

const config: ConfigurationObject = {
  [Environment.Local]: local,
  [Environment.Dev]: dev,
  [Environment.Stage]: stage,
  [Environment.Production]: production,
};

const configElement: Configuration = config[REACT_APP_ENV];

export const FIREBASE_SHORT_DYNAMIC_LINKS_URL =
  FIREBASE_SHORT_DYNAMIC_LINKS_TEMPLATE_URL.replace(
    "api_key",
    configElement.firebase.apiKey
  );

export default configElement;
