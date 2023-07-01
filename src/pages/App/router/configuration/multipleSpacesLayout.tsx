import { ALL_COMMON_PAGE_TABS, CommonPage } from "@/pages/common";
import { CommonCreationPage } from "@/pages/commonCreation";
import { CommonFeedPage } from "@/pages/commonFeed";
import { InboxPage } from "@/pages/inbox";
import { ROUTE_PATHS } from "@/shared/constants";
import { MultipleSpacesLayout } from "@/shared/layouts";
import { LayoutConfiguration, RouteType } from "../types";

const getCommonPageConfiguration = (): LayoutConfiguration["routes"] =>
  ALL_COMMON_PAGE_TABS.map((tab) => ({
    path: `${ROUTE_PATHS.COMMON}/${tab}` as ROUTE_PATHS,
    exact: true,
    component: CommonPage,
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
  ],
};
