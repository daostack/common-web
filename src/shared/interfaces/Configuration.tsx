import { Environment } from "../constants";

export interface Configuration {
  env: Environment;
  baseApiUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  cloudFunctionUrl: string;
  deadSeaCommonId: string;
}

export interface ConfigurationObject {
  [key: string]: Configuration;
}
