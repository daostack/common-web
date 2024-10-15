import { Environment, REACT_APP_ENV } from "./shared/constants";
import { Configuration, ConfigurationObject } from "./shared/interfaces";

const FIREBASE_SHORT_DYNAMIC_LINKS_TEMPLATE_URL =
  "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=api_key";

if (!Object.values(Environment).includes(REACT_APP_ENV)) {
  throw new Error(
    `REACT_APP_ENV has invalid value "${REACT_APP_ENV}". Allowed values: "${Object.values(
      Environment,
    ).join(", ")}"`,
  );
}

export const local: Configuration = {
  env: Environment.Local,
  firebase: {
    authDomain: "http://localhost:8086",
    databaseURL: "http://localhost:8080",
    apiKey: "AIzaSyDbTFuksgOkIVWDiFe_HG7-BE8X6Dwsg-0",
    projectId: "common-dev-34b09",
    storageBucket: "common-dev-34b09.appspot.com",
    messagingSenderId: "870639147922",
    appId: "1:870639147922:web:9ee954bb1dd52e25cb7f4b",
  },
  cloudFunctionUrl: "http://localhost:5003/common-dev-34b09/europe-west1",
  deadSeaCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
  parentsForClimateCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
  saadiaCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
  vapidKey:
    "BHVFyNetSC6oA2uFejnUFuDcSUYcas2R5lwW80z6gZc6zODp7rRdh2t8bht3LygJWjyI1toV165EYgdZqxCS_Y4",
};

const dev: Configuration = {
  env: Environment.Dev,
  firebase: {
    apiKey: "AIzaSyDbTFuksgOkIVWDiFe_HG7-BE8X6Dwsg-0",
    authDomain: "common-dev-34b09.firebaseapp.com",
    databaseURL: "https://common-dev-34b09.firebaseio.com",
    projectId: "common-dev-34b09",
    storageBucket: "common-dev-34b09.appspot.com",
    messagingSenderId: "870639147922",
    appId: "1:870639147922:web:9ee954bb1dd52e25cb7f4b",
  },
  cloudFunctionUrl: "https://europe-west1-common-dev-34b09.cloudfunctions.net",
  deadSeaCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
  parentsForClimateCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
  saadiaCommonId: "958dca85-7bc1-4714-95bd-1fc6343f0654",
  vapidKey:
    "BHVFyNetSC6oA2uFejnUFuDcSUYcas2R5lwW80z6gZc6zODp7rRdh2t8bht3LygJWjyI1toV165EYgdZqxCS_Y4",
};

const stage: Configuration = {
  env: Environment.Stage,
  firebase: {
    apiKey: "AIzaSyBASCWJMV64mZJObeFEitLmdUC1HqmtjJk",
    authDomain: "common-staging-1d426.firebaseapp.com",
    databaseURL: "https://common-staging-1d426.firebaseio.com",
    projectId: "common-staging-1d426",
    storageBucket: "common-staging-1d426.appspot.com",
    messagingSenderId: "701579202562",
    appId: "1:701579202562:web:5729d8a875f98f6709571b",
  },
  cloudFunctionUrl:
    "https://europe-west1-common-staging-1d426.cloudfunctions.net",
  deadSeaCommonId: "a55a1e9b-104a-4866-9f4f-3e017bbae281",
  parentsForClimateCommonId: "a55a1e9b-104a-4866-9f4f-3e017bbae281",
  saadiaCommonId: "a55a1e9b-104a-4866-9f4f-3e017bbae281",
  vapidKey:
    "BBvr8z8QaPSJJfIRxmjBrq5Vs49BY95uZK_6QFyR7gKWgwrs5toDy-hvwWEtk-rbkVHBgOu9l2orK45u1n--9M0",
};

const production: Configuration = {
  env: Environment.Production,
  firebase: {
    apiKey: "AIzaSyAlYrKLd6KNKVkhmNEMKfb0cWHSWicCBOY",
    authDomain: "common-production-67641.firebaseapp.com",
    databaseURL: "https://common-production-67641.firebaseio.com",
    projectId: "common-production-67641",
    storageBucket: "common-production-67641.appspot.com",
    messagingSenderId: "461029494046",
    appId: "1:461029494046:web:4e2e4afbbeb7b487b48d0f",
  },
  cloudFunctionUrl:
    "https://europe-west1-common-production-67641.cloudfunctions.net",
  deadSeaCommonId: "6cfbfae6-2e5c-4b3b-ba70-e8fd871f48e2",
  parentsForClimateCommonId: "04ac2ec2-5cb2-4ab9-ae3f-5f223f482768",
  saadiaCommonId: "7c8c8996-b678-44df-9a57-e291431eb00f",
  vapidKey:
    "BKJ324iR-B5SoDG42bMrC_Q_poAv7BO-Z3AuMh5Grrg6TxO1QnN6mgzt2KyFFax0JSuuUhUKP-OrcTUPfboVqns",
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
    configElement.firebase.apiKey,
  );

export default configElement;
