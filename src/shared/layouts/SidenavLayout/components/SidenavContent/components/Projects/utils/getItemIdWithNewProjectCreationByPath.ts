import { ROUTE_PATHS } from "@/shared/constants";
import { matchRoute } from "@/shared/utils";
import { getActiveItemIdByPath } from "./getActiveItemIdByPath";

export const getItemIdWithNewProjectCreationByPath = (path: string): string =>
  matchRoute(path, ROUTE_PATHS.V04_PROJECT_CREATION, { exact: true })
    ? getActiveItemIdByPath(path)
    : "";
