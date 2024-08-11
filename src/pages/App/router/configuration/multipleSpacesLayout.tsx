import React from "react";
// import { BillingPage } from "@/pages/billing";
// import { ALL_COMMON_PAGE_TABS, CommonPage } from "@/pages/common";
import { ALL_COMMON_PAGE_TABS } from "@/pages/common";
// import {
//   CommonCreationPage,
//   ProjectCreationPage,
// } from "@/pages/commonCreation";
// import { CommonEditingPage } from "@/pages/commonEditing";
// import { CommonFeedPage } from "@/pages/commonFeed";
// import { InboxPage } from "@/pages/inbox";
// import { ProfilePage } from "@/pages/profile";
// import { SettingsPage } from "@/pages/settings";
import { ROUTE_PATHS } from "@/shared/constants";
// import { MultipleSpacesLayout } from "@/shared/layouts";
import { LayoutConfiguration, RouteType } from "../types";

const CommonFeedPage = React.lazy(() =>
  import("../../../../pages/commonFeed").then((module) => ({
    default: module.CommonFeedPage,
  })),
);
const InboxPage = React.lazy(() =>
  import("../../../../pages/inbox").then((module) => ({
    default: module.InboxPage,
  })),
);
const ProfilePage = React.lazy(() =>
  import("../../../../pages/profile").then((module) => ({
    default: module.ProfilePage,
  })),
);
const SettingsPage = React.lazy(() =>
  import("../../../../pages/settings").then((module) => ({
    default: module.SettingsPage,
  })),
);
const MultipleSpacesLayout = React.lazy(() =>
  import("../../../../shared/layouts").then((module) => ({
    default: module.MultipleSpacesLayout,
  })),
);
const BillingPage = React.lazy(() =>
  import("../../../../pages/billing").then((module) => ({
    default: module.BillingPage,
  })),
);
const CommonPage = React.lazy(() =>
  import("../../../../pages/common").then((module) => ({
    default: module.CommonPage,
  })),
);
const CommonCreationPage = React.lazy(() =>
  import("../../../../pages/commonCreation").then((module) => ({
    default: module.CommonCreationPage,
  })),
);
const ProjectCreationPage = React.lazy(() =>
  import("../../../../pages/commonCreation").then((module) => ({
    default: module.ProjectCreationPage,
  })),
);
const CommonEditingPage = React.lazy(() =>
  import("../../../../pages/commonEditing").then((module) => ({
    default: module.CommonEditingPage,
  })),
);

export interface MultipleSpacesLayoutRouteOptions {
  withSidenav?: boolean;
  withBreadcrumbs?: boolean;
  withGoBack?: boolean;
  breadcrumbsItemsWithMenus?: boolean;
}

const getCommonPageConfiguration =
  (): LayoutConfiguration<MultipleSpacesLayoutRouteOptions>["routes"] =>
    ALL_COMMON_PAGE_TABS.map((tab) => ({
      path: `${ROUTE_PATHS.COMMON}/${tab}` as ROUTE_PATHS,
      exact: true,
      component: CommonPage,
      routeOptions: {
        withGoBack: true,
      },
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
        path: ROUTE_PATHS.COMMON_CREATION,
        exact: true,
        component: CommonCreationPage,
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
        component: ProjectCreationPage,
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
          withSidenav: false,
          withBreadcrumbs: false,
          withGoBack: true,
        },
      },
      {
        path: ROUTE_PATHS.BILLING,
        exact: true,
        component: BillingPage,
        routeOptions: {
          withSidenav: false,
          withBreadcrumbs: false,
          withGoBack: true,
        },
      },
      {
        path: ROUTE_PATHS.SETTINGS,
        exact: true,
        component: SettingsPage,
        routeOptions: {
          withSidenav: false,
          withBreadcrumbs: false,
          withGoBack: true,
        },
      },
    ],
  };
