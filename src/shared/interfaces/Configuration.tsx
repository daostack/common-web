import { Environment } from "@/shared/constants";

export interface Configuration {
  env: Environment;
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
