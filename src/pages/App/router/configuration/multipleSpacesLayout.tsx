import React, { lazy } from "react";
import { ROUTE_PATHS } from "@/shared/constants";
import { MultipleSpacesLayout } from "@/shared/layouts";
import { LayoutConfiguration, RouteType } from "../types";
import { ALL_COMMON_PAGE_TABS } from "@/pages/common";

const InboxPage = lazy(() => import("@/pages/inbox").then(module => ({ default: module.InboxPage })));
const CommonCreationPage = lazy(() => import("@/pages/commonCreation").then(module => ({ default: module.CommonCreationPage })));
const CommonFeedPage = lazy(() => import("@/pages/commonFeed").then(module => ({ default: module.CommonFeedPage })));
const ProjectCreationPage = lazy(() => import("@/pages/commonCreation").then(module => ({ default: module.ProjectCreationPage })));
const CommonEditingPage = lazy(() => import("@/pages/commonEditing").then(module => ({ default: module.CommonEditingPage })));
const ProfilePage = lazy(() => import("@/pages/profile").then(module => ({ default: module.ProfilePage })));
const BillingPage = lazy(() => import("@/pages/billing").then(module => ({ default: module.BillingPage })));
const SettingsPage = lazy(() => import("@/pages/settings").then(module => ({ default: module.SettingsPage })));
const CommonPage = lazy(() => import("@/pages/common").then(module => ({ default: module.CommonPage })));

export interface MultipleSpacesLayoutRouteOptions {
  withSidenav?: boolean;
  withBreadcrumbs?: boolean;
  withGoBack?: boolean;
  breadcrumbsItemsWithMenus?: boolean;
}

const getCommonPageConfiguration = (): LayoutConfiguration["routes"] =>
  ALL_COMMON_PAGE_TABS.map((tab) => ({
    path: `${ROUTE_PATHS.COMMON}/${tab}` as ROUTE_PATHS,
    exact: true,
    component: CommonPage,
    routeOptions: {
      withGoBack: true,
    },
  }));

export const MULTIPLE_SPACES_LAYOUT_CONFIGURATION: LayoutConfiguration = {
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
