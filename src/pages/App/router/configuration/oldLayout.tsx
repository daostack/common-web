import React, { lazy } from "react";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import { OldLayout } from "@/shared/layouts";
import { LayoutConfiguration, RouteType } from "../types";

const LandingContainer = lazy(() => import("@/pages/Landing").then(module => ({ default: module.LandingContainer })));
const ContactUsContainer = lazy(() => import("@/pages/Landing").then(module => ({ default: module.ContactUsContainer })));
const CommonDetailContainer = lazy(() => import("@/pages/OldCommon").then(module => ({ default: module.CommonDetailContainer })));
const SupportersContainer = lazy(() => import("@/pages/OldCommon").then(module => ({ default: module.SupportersContainer })));
const ProposalContainer = lazy(() => import("@/pages/OldCommon").then(module => ({ default: module.ProposalContainer })));
const ProposalCommentContainer = lazy(() => import("@/pages/OldCommon").then(module => ({ default: module.ProposalCommentContainer })));
const DiscussionContainer = lazy(() => import("@/pages/OldCommon").then(module => ({ default: module.DiscussionContainer })));
const DiscussionMessageContainer = lazy(() => import("@/pages/OldCommon").then(module => ({ default: module.DiscussionMessageContainer })));
const MyAccountContainer = lazy(() => import("@/pages/MyAccount").then(module => ({ default: module.MyAccountContainer })));
const MyCommonsContainer = lazy(() => import("@/pages/OldCommon/containers/MyCommonsContainer").then(module => ({ default: module.MyCommonsContainer })));
const SubmitInvoicesContainer = lazy(() => import("@/pages/Invoices").then(module => ({ default: module.SubmitInvoicesContainer })));
const TrusteeContainer = lazy(() => import("@/pages/Trustee").then(module => ({ default: module.TrusteeContainer })));

export interface OldLayoutRouteOptions {
  footer?:
    | boolean
    | {
        screenSizeWhenDisplay?: ScreenSize;
      };
}

export const OLD_LAYOUT_CONFIGURATION: LayoutConfiguration = {
  component: OldLayout,
  routes: [
    {
      path: ROUTE_PATHS.HOME,
      exact: true,
      component: LandingContainer,
    },
    {
      path: ROUTE_PATHS.CONTACT_US,
      exact: true,
      component: ContactUsContainer,
    },
    {
      path: ROUTE_PATHS.V02_COMMON,
      exact: true,
      component: CommonDetailContainer,
      routeOptions: {
        footer: {
          screenSizeWhenDisplay: ScreenSize.Desktop,
        },
      },
    },
    {
      path: ROUTE_PATHS.COMMON_SUPPORT,
      exact: true,
      component: SupportersContainer,
      routeOptions: {
        footer: false,
      },
    },
    {
      path: ROUTE_PATHS.PROPOSAL_DETAIL,
      component: ProposalContainer,
      type: RouteType.Private,
    },
    {
      path: ROUTE_PATHS.PROPOSAL_COMMENT,
      component: ProposalCommentContainer,
      type: RouteType.Private,
      routeOptions: {
        footer: {
          screenSizeWhenDisplay: ScreenSize.Desktop,
        },
      },
    },
    {
      path: ROUTE_PATHS.DISCUSSION_DETAIL,
      component: DiscussionContainer,
      type: RouteType.Private,
      routeOptions: {
        footer: {
          screenSizeWhenDisplay: ScreenSize.Desktop,
        },
      },
    },
    {
      path: ROUTE_PATHS.DISCUSSION_MESSAGE,
      component: DiscussionMessageContainer,
      type: RouteType.Private,
      routeOptions: {
        footer: {
          screenSizeWhenDisplay: ScreenSize.Desktop,
        },
      },
    },
    {
      path: ROUTE_PATHS.MY_ACCOUNT,
      component: MyAccountContainer,
      type: RouteType.Private,
    },
    {
      path: ROUTE_PATHS.MY_COMMONS,
      component: MyCommonsContainer,
      type: RouteType.Private,
    },
    {
      path: ROUTE_PATHS.SUBMIT_INVOICES,
      component: SubmitInvoicesContainer,
    },
    {
      path: ROUTE_PATHS.TRUSTEE,
      component: TrusteeContainer,
    },
  ],
};
