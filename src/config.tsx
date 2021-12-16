import { Configuration, ConfigurationObject } from "./shared/interfaces";
const { REACT_APP_ENV = "dev" } = process.env;

const dev: Configuration = {
  env: REACT_APP_ENV,
  baseApiUrl: "http://localhost:4000/api/v1/",
  firebase: {
    apiKey: "AIzaSyD4jU20VNVSdhqrCpqDj_ufNKCHW1lognM",
    authDomain: "common-dev-dea4e.firebaseapp.com",
    projectId: "common-dev-dea4e",
    storageBucket: "common-dev-dea4e.appspot.com",
    messagingSenderId: "1027354410661",
    appId: "1:1027354410661:web:af746f9f60f4483b5b974c",
    databaseURL: "https://common-dev-dea4e.firebaseio.com",
  },
  cloudFunctionUrl:
    "https://us-central1-common-dev-dea4e.cloudfunctions.net",
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
  dev,
  stage,
  production,
};

const configElement: Configuration = config[REACT_APP_ENV];
export default configElement;
