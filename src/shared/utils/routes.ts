import { CommonTab } from "@/pages/common";
import { QueryParamKey, ROUTE_PATHS } from "@/shared/constants";

export const getCommonPagePath = (
  commonId: string,
  tab?: CommonTab,
): string => {
  const path = ROUTE_PATHS.COMMON.replace(":id", commonId);

  return `${path}${tab ? `?${QueryParamKey.Tab}=${tab}` : ""}`;
};

export const getCommonPageAboutTabPath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_ABOUT_TAB.replace(":id", commonId);

export const getCommonEditingPagePath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_EDITING.replace(":id", commonId);

export const getCommonSupportPagePath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_SUPPORT.replace(":id", commonId);
