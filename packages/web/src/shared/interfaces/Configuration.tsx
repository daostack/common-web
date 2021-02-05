import { Provider } from "react-social-login";

export interface Configuration {
  env: string;
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
  socialLoginClientId: Partial<{ [key in Provider]: string }>;
}

export interface ConfigurationObject {
  [key: string]: Configuration;
}
