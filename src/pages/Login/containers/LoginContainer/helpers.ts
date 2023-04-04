import { ParsedQuery } from "query-string";
import {
  AUTH_CODE_FOR_SIGN_UP,
  QueryParamKey,
  ROUTE_PATHS,
} from "@/shared/constants";
import { matchRoute } from "@/shared/utils";

const PAGES_WITH_ALLOWED_SIGN_UP = [
  ROUTE_PATHS.COMMON_SUPPORT,
  ROUTE_PATHS.COMMON_DETAIL,
  ROUTE_PATHS.COMMON,
  ROUTE_PATHS.COMMON_ABOUT_TAB,
  ROUTE_PATHS.COMMON_MEMBERS_TAB,
  ROUTE_PATHS.COMMON_WALLET_TAB,
];

export const getAuthCode = (
  queryParams: ParsedQuery,
  pathname: string,
): { authCode: string; shouldOpenLoginModal: boolean } => {
  const authCode = queryParams[QueryParamKey.AuthCode];

  if (typeof authCode === "string") {
    return {
      authCode,
      shouldOpenLoginModal: true,
    };
  }
  if (
    PAGES_WITH_ALLOWED_SIGN_UP.some((page) =>
      matchRoute(pathname, page, { exact: true }),
    )
  ) {
    return {
      authCode: AUTH_CODE_FOR_SIGN_UP,
      shouldOpenLoginModal: false,
    };
  }

  return { authCode: "", shouldOpenLoginModal: false };
};
