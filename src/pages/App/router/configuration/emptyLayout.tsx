import React from "react";
// import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
// import { EmptyPage } from "@/pages/empty";
import { ROUTE_PATHS } from "@/shared/constants";
import { EmptyLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

const EmptyPage = React.lazy(() =>
  import("../../../../pages/empty").then((module) => ({
    default: module.EmptyPage,
  })),
);
const PrivacyPolicy = React.lazy(() =>
  import("../../../../pages/PrivacyPolicy").then((module) => ({
    default: module.PrivacyPolicy,
  })),
);

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
