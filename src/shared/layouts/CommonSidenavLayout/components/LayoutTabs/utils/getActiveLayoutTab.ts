import { ROUTE_PATHS } from "@/shared/constants";
import { matchOneOfRoutes, matchRoute } from "@/shared/utils";
import { LayoutTab } from "../../../constants";

export const getActiveLayoutTab = (path: string): LayoutTab | null => {
  if (matchRoute(path, ROUTE_PATHS.PROFILE)) {
    return LayoutTab.Profile;
  }
  if (matchOneOfRoutes(path, [ROUTE_PATHS.INBOX, ROUTE_PATHS.V04_INBOX])) {
    return LayoutTab.Inbox;
  }
  if (
    matchOneOfRoutes(path, [ROUTE_PATHS.COMMON, ROUTE_PATHS.V04_COMMON], {
      exact: false,
    })
  ) {
    return LayoutTab.Spaces;
  }

  return null;
};
