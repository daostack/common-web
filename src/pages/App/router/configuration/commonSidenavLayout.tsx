import { CommonCreationPage } from "@/pages/commonCreation";
import { CommonFeedPage } from "@/pages/commonFeed";
import { InboxPage } from "@/pages/inbox";
import { ROUTE_PATHS } from "@/shared/constants";
import { CommonSidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export interface CommonSidenavLayoutRouteOptions {
  sidenav?: boolean;
}

export const COMMON_SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration<CommonSidenavLayoutRouteOptions> =
  {
    component: CommonSidenavLayout,
    routes: [
      {
        path: ROUTE_PATHS.INBOX,
        exact: true,
        component: InboxPage,
      },
      {
        path: ROUTE_PATHS.COMMON,
        exact: true,
        component: CommonFeedPage,
      },
      {
        path: ROUTE_PATHS.PROJECT_CREATION,
        exact: true,
        component: CommonCreationPage,
      },
    ],
  };
