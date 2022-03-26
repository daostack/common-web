export const SMALL_SCREEN_BREAKPOINT = "770px";

export const BASE_URL = window.location.origin;

export enum ScreenSize {
  Mobile = "MOBILE",
  Desktop = "DESKTOP",
}

export const COMMON_APP_APP_STORE_LINK =
  "https://apps.apple.com/il/app/common-collaborative-action/id1512785740";
export const COMMON_APP_GOOGLE_PLAY_LINK =
  "https://play.google.com/store/apps/details?id=com.daostack.common";

export const TERMS_OF_USE_URL =
  "https://uploads-ssl.webflow.com/5ed24eec6103a37f0ee6c20a/5f1967668c1f4f8589734424_Daostack_Common_O%C3%9C_Terms_and_Conditions_220120.pdf";

export const CONTACT_EMAIL = "hi@common.io";
export const SUPPORT_EMAIL = "support@common.io";

export const MIN_CONTRIBUTION_ILS_AMOUNT = 10_00; // ₪10 * 100
export const MAX_CONTRIBUTION_ILS_AMOUNT = 5000_00; // ₪5000 * 100
export const MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION = 500_00; // ₪500 * 100

export enum MobileOperatingSystem {
  WindowsPhone = "Windows Phone",
  Android = "Android",
  iOS = "iOS",
  unknown = "unknown",
}

/** This is used when we need to set colors via the JavaScript */
export enum Colors {
  gray = "#92a2b5",
  white = "#FFFFFF",
  black = "#000000",
  purple = "#7786ff",
  secondaryBlue = "#001a36",
  lightPurple = "#F1F2FF",
  lightGray3 = "#d5d5e4",
  shadow2 = "rgba(0, 26, 54, 0.08)",
  transparent = "transparent",
}

export const AXIOS_TIMEOUT = 1000000;

export const DEFAULT_VIEWPORT_CONFIG = "width=device-width, initial-scale=1";
export const VIEWPORT_CONFIG_TO_BLOCK_AUTO_ZOOM = `${DEFAULT_VIEWPORT_CONFIG}, maximum-scale=1.0, user-scalable=0`;

export const RECAPTCHA_CONTAINER_ID = "recaptcha-container-id";

export const MAX_LINK_TITLE_LENGTH = 30;
export const HTTPS_URL_REGEXP = /^(?:https:\/\/)[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/;
export const EMIAL_REGEXP = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const NUMBERS_ONLY_REGEXP = /^[0-9]*$/;

