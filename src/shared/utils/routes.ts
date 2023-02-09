import { CommonTab } from "@/pages/common";
import { QueryParamKey, ROUTE_PATHS } from "@/shared/constants";

export const getCommonPagePath = (
  commonId: string,
  tab?: CommonTab,
): string => {
  const path = ROUTE_PATHS.COMMON.replace(":id", commonId);

  return `${path}${tab ? `?${QueryParamKey.Tab}=${tab}` : ""}`;
};
