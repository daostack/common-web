import "@testing-library/jest-dom/extend-expect";

declare module 'yup' {
    export interface StringSchema {
      /**
       * Check for phone number validity.
       *
       * @param {String} [countryCode] The country code to check against.
       * @param {String} [errorMessage=DEFAULT_MESSAGE] The error message to return if the validation fails.
       */
      phone(
        countryCode?: string,
        errorMessage?: string
      ): StringSchema;
    }
  }

  declare global {
    interface Window {
      ReactNativeWebView: {
        postMessage: (message: string) => void;
      };
    }
  }
