import { CommonTab } from "@/pages/common";
import { QueryParamKey, ROUTE_PATHS } from "@/shared/constants";

export const getCommonPagePath = (
  commonId: string,
  queryParamKey?: {
    tab?: CommonTab;
    item?: string;
  },
): string => {
  const basePath = ROUTE_PATHS.COMMON.replace(":id", commonId);

  if (queryParamKey?.item) {
    return `${basePath}?${QueryParamKey.Item}=${queryParamKey?.item}`;
  }

  if (queryParamKey?.tab) {
    return `${basePath}?${QueryParamKey.Tab}=${queryParamKey.tab}`;
  }

  return basePath;
};

export const getCommonPageAboutTabPath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_ABOUT_TAB.replace(":id", commonId);

export const getProjectCreationPagePath = (commonId: string): string =>
  ROUTE_PATHS.PROJECT_CREATION.replace(":id", commonId);

export const getCommonEditingPagePath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_EDITING.replace(":id", commonId);

export const getCommonSupportPagePath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_SUPPORT.replace(":id", commonId);

export const getInboxPagePath = (): string => ROUTE_PATHS.INBOX;

export const getProfilePagePath = (): string => ROUTE_PATHS.PROFILE;

// v03
export const getCommonPagePath_v03 = (
  commonId: string,
  tab?: CommonTab,
): string => {
  const path = ROUTE_PATHS.V03_COMMON.replace(":id", commonId);

  return `${path}${tab ? `?${QueryParamKey.Tab}=${tab}` : ""}`;
};
