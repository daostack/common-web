import { CommonTab } from "@/pages/common";
import { QueryParamKey, ROUTE_PATHS } from "@/shared/constants";

export type GetCommonPagePath = (commonId: string, tab?: CommonTab) => string;
export type GetCommonPageAboutTabPath = (commonId: string) => string;
export type GetGeneralPagePath = () => ROUTE_PATHS;
export type GetGeneralPageWithCommonIdPath = (commonId: string) => string;

export const buildCommonPagePath = (
  baseCommonPagePath: string,
  commonId: string,
  tab?: CommonTab,
): string => {
  const path = baseCommonPagePath.replace(":id", commonId);

  return `${path}${tab ? `?${QueryParamKey.Tab}=${tab}` : ""}`;
};

export const getCommonPagePath: GetCommonPagePath = (...args) =>
  buildCommonPagePath(ROUTE_PATHS.COMMON, ...args);

export const getCommonPageAboutTabPath: GetCommonPageAboutTabPath = (
  commonId,
) => ROUTE_PATHS.COMMON_ABOUT_TAB.replace(":id", commonId);

export const getProjectCreationPagePath: GetGeneralPageWithCommonIdPath = (
  commonId,
) => ROUTE_PATHS.PROJECT_CREATION.replace(":id", commonId);

export const getCommonEditingPagePath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_EDITING.replace(":id", commonId);

export const getCommonSupportPagePath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_SUPPORT.replace(":id", commonId);

export const getInboxPagePath: GetGeneralPagePath = () => ROUTE_PATHS.INBOX;

export const getProfilePagePath: GetGeneralPagePath = () => ROUTE_PATHS.PROFILE;

export const getBillingPagePath: GetGeneralPagePath = () => ROUTE_PATHS.BILLING;

// v03
export const getCommonPagePath_v03: GetCommonPagePath = (...args) =>
  buildCommonPagePath(ROUTE_PATHS.V03_COMMON, ...args);

// v04
export const getCommonPagePath_v04: GetCommonPagePath = (...args) =>
  buildCommonPagePath(ROUTE_PATHS.V04_COMMON, ...args);

export const getCommonPageAboutTabPath_v04: GetCommonPageAboutTabPath = (
  commonId,
) => ROUTE_PATHS.V04_COMMON_ABOUT_TAB.replace(":id", commonId);

export const getProjectCreationPagePath_v04: GetGeneralPageWithCommonIdPath = (
  commonId,
) => ROUTE_PATHS.V04_PROJECT_CREATION.replace(":id", commonId);

export const getCommonEditingPagePath_v04 = (commonId: string): string =>
  ROUTE_PATHS.V04_COMMON_EDITING.replace(":id", commonId);

export const getInboxPagePath_v04: GetGeneralPagePath = () =>
  ROUTE_PATHS.V04_INBOX;

export const getProfilePagePath_v04: GetGeneralPagePath = () =>
  ROUTE_PATHS.V04_PROFILE;

export const getBillingPagePath_v04: GetGeneralPagePath = () =>
  ROUTE_PATHS.V04_BILLING;
