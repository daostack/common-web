import { BillingPage } from "@/pages/billing";
import { ALL_COMMON_PAGE_TABS, CommonPage_v04 } from "@/pages/common";
import { CommonCreationV04Page } from "@/pages/commonCreation";
import { CommonEditingV04Page } from "@/pages/commonEditing";
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
      component: CommonPage_v04,
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
        component: CommonCreationV04Page,
      },
      {
        path: ROUTE_PATHS.V04_COMMON_EDITING,
        exact: true,
        component: CommonEditingV04Page,
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
