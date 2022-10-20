import { Environment } from "./environment";

export const REACT_APP_ENV = (process.env.REACT_APP_ENV as Environment) || Environment.Dev;

export const SMALL_SCREEN_BREAKPOINT = "770px";

export const BASE_URL = window.location.origin;
export const AUTH_CODE_FOR_SIGN_UP = "5a81Ec29e6";

export enum ScreenSize {
  Mobile = "MOBILE",
  Desktop = "DESKTOP",
}

export enum Orientation {
  Horizontal,
  Vertical,
}

export const COMMON_APP_APP_STORE_LINK = "https://apps.apple.com/il/app/common-collaborative-action/id1512785740";
export const COMMON_APP_GOOGLE_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.daostack.common";

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
  lightGray4 = "#f4f6ff",
  lightGray9 = "#d2d8ff",
  shadow2 = "rgba(0, 26, 54, 0.08)",
  error = "#ef5456",
  transparent = "transparent",
}

export const AXIOS_TIMEOUT = 1000000;

export const DEFAULT_VIEWPORT_CONFIG = "width=device-width, initial-scale=1";
export const VIEWPORT_CONFIG_TO_BLOCK_AUTO_ZOOM = `${DEFAULT_VIEWPORT_CONFIG}, maximum-scale=1.0, user-scalable=0`;

export const RECAPTCHA_CONTAINER_ID = "recaptcha-container-id";

export const MAX_LINK_TITLE_LENGTH = 30;
export const NUMBERS_ONLY_REGEXP = /^[0-9]*$/;

export const URL_REGEXP = /^((((https?|ftp):)?\/\/)|www.)(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i;
export const NAME_REGEXP = /^[aA-zZ\s]+$/;

export enum ShareViewType {
  Popup,
  ModalMobile,
  ModalDesktop,
}

export enum SharePopupVariant {
  BottomLeft,
  TopCenter,
}

export const DAYS_TILL_REMOVAL_FROM_COMMON_AFTER_CANCELING = 16;

export enum ChatType {
  ProposalComments,
  DiscussionMessages,
}

export enum ChartType {
  Line = "line",
  Bar = "bar",
  Scatter = "scatter",
  Bubble = "bubble",
  Pie = "pie",
  Doughnut = "doughnut",
  PolarArea = "polarArea",
  Radar = "radar",
}

export enum ENTITY_TYPES {
  Proposal = "proposal",
  Discussion = "discussion",
  Common = "common",
  DiscussionMessage = "discussionMessage",
}
