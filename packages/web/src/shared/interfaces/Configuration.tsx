export interface Configuration {
  env: string;
  baseApiUrl: string;
}

export interface ConfigurationObject {
  [key: string]: Configuration;
}
