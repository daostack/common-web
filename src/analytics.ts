import ReactGA from "react-ga4";
import {
  Environment,
  GA_MEASUREMENT_ID,
  REACT_APP_ENV,
} from "./shared/constants";

if (REACT_APP_ENV === Environment.Production) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}
