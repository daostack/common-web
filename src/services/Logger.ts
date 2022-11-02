import { Environment, REACT_APP_ENV } from "@/shared/constants";

class Logger {
  public error = (error: Error | unknown): void => {
    if (REACT_APP_ENV !== Environment.Production) {
      console.error(error);
    } else {
      // Log to a service, like Sentry
    }
  };
}

export default new Logger();
