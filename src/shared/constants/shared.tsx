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

export const CONTACT_EMAIL = "hi@common.io";
export const SUPPORT_EMAIL = "support@common.io";

export const MIN_CONTRIBUTION_ILS_AMOUNT = 10_00; // ₪10 * 100
export const MAX_CONTRIBUTION_ILS_AMOUNT = 5000_00; // ₪5000 * 100

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
