import { SubmitInvoicesContainer } from "@/pages/Invoices";
import { ContactUsContainer, LandingContainer } from "@/pages/Landing";
import { MyAccountContainer } from "@/pages/MyAccount";
import {
  CommonDetailContainer,
  CommonListContainer,
  DiscussionContainer,
  DiscussionMessageContainer,
  ProposalCommentContainer,
  ProposalContainer,
  SupportersContainer,
} from "@/pages/OldCommon";
import { MyCommonsContainer } from "@/pages/OldCommon/containers/MyCommonsContainer";
import { TrusteeContainer } from "@/pages/Trustee";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import { OldLayout } from "@/shared/layouts";
import { LayoutConfiguration, RouteType } from "../types";

export interface OldLayoutRouteOptions {
  footer?:
    | boolean
    | {
        screenSizeWhenDisplay?: ScreenSize;
      };
}

export const OLD_LAYOUT_CONFIGURATION: LayoutConfiguration<OldLayoutRouteOptions> =
  {
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
        path: ROUTE_PATHS.COMMON_LIST,
        exact: true,
        component: CommonListContainer,
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
