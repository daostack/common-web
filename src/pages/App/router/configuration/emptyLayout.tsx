import React, { lazy } from "react";
import { ROUTE_PATHS } from "@/shared/constants";
import { EmptyLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

// Wrapping non-default exports for lazy loading
const EmptyPage = lazy(() => import("@/pages/empty").then(module => ({ default: module.EmptyPage })));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy").then(module => ({ default: module.PrivacyPolicy })));

export const EMPTY_LAYOUT_CONFIGURATION: LayoutConfiguration = {
  component: EmptyLayout,
  routes: [
    {
      path: ROUTE_PATHS.MOBILE_LOADER,
      exact: true,
      component: EmptyPage,
    },
    {
      path: ROUTE_PATHS.PRIVACY_POLICY,
      exact: true,
      component: PrivacyPolicy,
    },
  ],
};
