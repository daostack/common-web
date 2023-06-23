import { BillingPage } from "@/pages/billing";
import { ALL_COMMON_PAGE_TABS, CommonPage } from "@/pages/common";
import { CommonCreationPage } from "@/pages/commonCreation";
import { CommonEditingPage } from "@/pages/commonEditing";
import { CommonFeedPage } from "@/pages/commonFeed";
import { InboxPage } from "@/pages/inbox";
import { ProfilePage } from "@/pages/profile";
import { ROUTE_PATHS } from "@/shared/constants";
import { CommonSidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration, RouteType } from "../types";

export interface CommonSidenavLayoutRouteOptions {
  sidenav?: boolean;
}

const getCommonPageConfiguration =
  (): LayoutConfiguration<CommonSidenavLayoutRouteOptions>["routes"] =>
    ALL_COMMON_PAGE_TABS.map((tab) => ({
      path: `${ROUTE_PATHS.V04_COMMON}/${tab}` as ROUTE_PATHS,
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
        type: RouteType.Private,
        unauthenticatedRedirectPath: ROUTE_PATHS.HOME,
      },
      {
        path: ROUTE_PATHS.V04_COMMON,
        exact: true,
        component: CommonFeedPage,
      },
      ...getCommonPageConfiguration(),
      {
        path: ROUTE_PATHS.V04_PROJECT_CREATION,
        exact: true,
        component: CommonCreationPage,
      },
      {
        path: ROUTE_PATHS.V04_COMMON_EDITING,
        exact: true,
        component: CommonEditingPage,
      },
      {
        path: ROUTE_PATHS.PROFILE,
        exact: true,
        component: ProfilePage,
      },
      {
        path: ROUTE_PATHS.BILLING,
        exact: true,
        component: BillingPage,
      },
    ],
  };
