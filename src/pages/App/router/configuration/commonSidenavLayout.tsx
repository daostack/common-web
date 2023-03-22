import { ALL_COMMON_PAGE_TABS, CommonPage } from "@/pages/common";
import { CommonCreationPage } from "@/pages/commonCreation";
import { CommonFeedPage } from "@/pages/commonFeed";
import { InboxPage } from "@/pages/inbox";
import { ROUTE_PATHS } from "@/shared/constants";
import { CommonSidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export interface CommonSidenavLayoutRouteOptions {
  sidenav?: boolean;
}

const getCommonPageConfiguration =
  (): LayoutConfiguration<CommonSidenavLayoutRouteOptions>["routes"] =>
    ALL_COMMON_PAGE_TABS.map((tab) => ({
      path: `${ROUTE_PATHS.COMMON}/${tab}` as ROUTE_PATHS,
      exact: true,
      component: CommonPage,
    }));

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
      ...getCommonPageConfiguration(),
      {
        path: ROUTE_PATHS.PROJECT_CREATION,
        exact: true,
        component: CommonCreationPage,
      },
    ],
  };
