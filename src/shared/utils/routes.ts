import { CommonTab } from "@/pages/common";
import { QueryParamKey, ROUTE_PATHS } from "@/shared/constants";

export const getCommonPagePath = (
  commonId: string,
  tab?: CommonTab,
): string => {
  const path = ROUTE_PATHS.COMMON.replace(":id", commonId);

  return `${path}${tab ? `?${QueryParamKey.Tab}=${tab}` : ""}`;
};

export const getCommonEditingPagePath = (commonId: string): string =>
  ROUTE_PATHS.COMMON_EDITING.replace(":id", commonId);
