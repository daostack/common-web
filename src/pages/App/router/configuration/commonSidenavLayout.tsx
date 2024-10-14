import React, { lazy } from "react";
import { ROUTE_PATHS } from "@/shared/constants";
import { CommonSidenavLayout } from "@/shared/layouts";
import { LayoutConfiguration, RouteType } from "../types";
import { ALL_COMMON_PAGE_TABS } from "@/pages/common";

const InboxPage_v04 = lazy(() => import("@/pages/inbox").then(module => ({ default: module.InboxPage_v04 })));
const CommonCreationPage = lazy(() => import("@/pages/commonCreation").then(module => ({ default: module.CommonCreationPage })));
const CommonFeedPage_v04 = lazy(() => import("@/pages/commonFeed").then(module => ({ default: module.CommonFeedPage_v04 })));
const ProjectCreationPage_v04 = lazy(() => import("@/pages/commonCreation").then(module => ({ default: module.ProjectCreationPage_v04 })));
const CommonEditingPage_v04 = lazy(() => import("@/pages/commonEditing").then(module => ({ default: module.CommonEditingPage_v04 })));
const ProfilePage_v04 = lazy(() => import("@/pages/profile").then(module => ({ default: module.ProfilePage_v04 })));
const BillingPage_v04 = lazy(() => import("@/pages/billing").then(module => ({ default: module.BillingPage_v04 })));
const SettingsPage_v04 = lazy(() => import("@/pages/settings").then(module => ({ default: module.SettingsPage_v04 })));
const CommonPage_v04 = lazy(() => import("@/pages/common").then(module => ({ default: module.CommonPage_v04 })));

export interface CommonSidenavLayoutRouteOptions {
  sidenav?: boolean;
}

const getCommonPageConfiguration = (): LayoutConfiguration["routes"] =>
  ALL_COMMON_PAGE_TABS.map((tab) => ({
    path: `${ROUTE_PATHS.V04_COMMON}/${tab}` as ROUTE_PATHS,
    exact: true,
    component: CommonPage_v04,
  }));

export const COMMON_SIDENAV_LAYOUT_CONFIGURATION: LayoutConfiguration = {
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
      path: ROUTE_PATHS.V04_COMMON_CREATION,
      exact: true,
      component: CommonCreationPage,
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
    {
      path: ROUTE_PATHS.V04_SETTINGS,
      exact: true,
      component: SettingsPage_v04,
    },
  ],
};
