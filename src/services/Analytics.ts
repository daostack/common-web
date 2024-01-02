import ReactGA from "react-ga4";
import {
  Environment,
  GA_MEASUREMENT_ID,
  REACT_APP_ENV,
} from "@/shared/constants";
import { emptyFunction } from "@/shared/utils/emptyFunction";

interface Analytics {
  initialize: () => void;
  setUserId: (userId?: string | null) => void;
}

class AnalyticsServiceStub implements Analytics {
  public initialize = emptyFunction;
  public setUserId = emptyFunction;
}

class AnalyticsService implements Analytics {
  public initialize = () => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  };

  public setUserId = (userId: string | null = null) => {
    ReactGA.set({ userId });
  };
}

export default REACT_APP_ENV === Environment.Production
  ? new AnalyticsService()
  : new AnalyticsServiceStub();
