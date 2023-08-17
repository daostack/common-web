import { BillingPage_v04 } from "@/pages/billing";
import { ALL_COMMON_PAGE_TABS, CommonPage_v04 } from "@/pages/common";
import { ProjectCreationPage_v04 } from "@/pages/commonCreation";
import { CommonEditingPage_v04 } from "@/pages/commonEditing";
import { CommonFeedPage_v04 } from "@/pages/commonFeed";
import { InboxPage_v04 } from "@/pages/inbox";
import { ProfilePage_v04 } from "@/pages/profile";
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
        path: ROUTE_PATHS.V04_INBOX,
        exact: true,
        component: InboxPage_v04,
        type: RouteType.Private,
        unauthenticatedRedirectPath: ROUTE_PATHS.HOME,
      },
      {
        path: ROUTE_PATHS.V04_COMMON,
        exact: true,
        component: CommonFeedPage_v04,
      },
      ...getCommonPageConfiguration(),
      {
        path: ROUTE_PATHS.V04_PROJECT_CREATION,
        exact: true,
        component: ProjectCreationPage_v04,
      },
      {
        path: ROUTE_PATHS.V04_COMMON_EDITING,
        exact: true,
        component: CommonEditingPage_v04,
      },
      {
        path: ROUTE_PATHS.V04_PROFILE,
        exact: true,
        component: ProfilePage_v04,
      },
      {
        path: ROUTE_PATHS.V04_BILLING,
        exact: true,
        component: BillingPage_v04,
      },
    ],
  };
