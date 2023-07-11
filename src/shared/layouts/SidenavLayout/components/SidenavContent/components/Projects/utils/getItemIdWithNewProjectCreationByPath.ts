import { ROUTE_PATHS } from "@/shared/constants";
import { matchOneOfRoutes } from "@/shared/utils";
import { getActiveItemIdByPath } from "./getActiveItemIdByPath";

export const getItemIdWithNewProjectCreationByPath = (path: string): string =>
  matchOneOfRoutes(
    path,
    [ROUTE_PATHS.PROJECT_CREATION, ROUTE_PATHS.V04_PROJECT_CREATION],
    { exact: true },
  )
    ? getActiveItemIdByPath(path)
    : "";
