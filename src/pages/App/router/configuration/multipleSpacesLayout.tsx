import { BillingPage } from "@/pages/billing";
import { ALL_COMMON_PAGE_TABS, CommonPage } from "@/pages/common";
import { CommonCreationPage } from "@/pages/commonCreation";
import { CommonEditingPage } from "@/pages/commonEditing";
import { CommonFeedPage } from "@/pages/commonFeed";
import { InboxPage } from "@/pages/inbox";
import { ProfilePage } from "@/pages/profile";
import { ROUTE_PATHS } from "@/shared/constants";
import { MultipleSpacesLayout } from "@/shared/layouts";
import { LayoutConfiguration, RouteType } from "../types";

export interface MultipleSpacesLayoutRouteOptions {
  sidenav?: boolean;
  withBreadcrumbs?: boolean;
  breadcrumbsItemsWithMenus?: boolean;
}

const getCommonPageConfiguration =
  (): LayoutConfiguration<MultipleSpacesLayoutRouteOptions>["routes"] =>
    ALL_COMMON_PAGE_TABS.map((tab) => ({
      path: `${ROUTE_PATHS.COMMON}/${tab}` as ROUTE_PATHS,
      exact: true,
      component: CommonPage,
    }));

export const MULTIPLE_SPACES_LAYOUT_CONFIGURATION: LayoutConfiguration<MultipleSpacesLayoutRouteOptions> =
  {
    component: MultipleSpacesLayout,
    routes: [
      {
        path: ROUTE_PATHS.INBOX,
        exact: true,
        component: InboxPage,
        type: RouteType.Private,
        unauthenticatedRedirectPath: ROUTE_PATHS.HOME,
        routeOptions: {
          breadcrumbsItemsWithMenus: false,
        },
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
      {
        path: ROUTE_PATHS.COMMON_EDITING,
        exact: true,
        component: CommonEditingPage,
      },
      {
        path: ROUTE_PATHS.PROFILE,
        exact: true,
        component: ProfilePage,
        routeOptions: {
          sidenav: false,
          withBreadcrumbs: false,
        },
      },
      {
        path: ROUTE_PATHS.BILLING,
        exact: true,
        component: BillingPage,
        routeOptions: {
          sidenav: false,
          withBreadcrumbs: false,
        },
      },
    ],
  };
