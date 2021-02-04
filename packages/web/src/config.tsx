import { Configuration, ConfigurationObject } from "./shared/interfaces";
const { REACT_APP_ENV = "dev" } = process.env;

const dev: Configuration = {
  env: REACT_APP_ENV,
  baseApiUrl: "http://localhost:4000/api/v1/",
};

const stage: Configuration = {
  ...dev,
};

const production: Configuration = {
  ...dev,
};

const config: ConfigurationObject = {
  dev,
  stage,
  production,
};

const configElement: Configuration = config[REACT_APP_ENV];
export default configElement;
