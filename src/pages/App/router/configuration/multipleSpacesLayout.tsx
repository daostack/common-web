import { ALL_COMMON_PAGE_TABS, CommonPage } from "@/pages/common";
import { CommonFeedPage } from "@/pages/commonFeed";
import { ROUTE_PATHS } from "@/shared/constants";
import { MultipleSpacesLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

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
      path: ROUTE_PATHS.COMMON,
      exact: true,
      component: CommonFeedPage,
    },
    ...getCommonPageConfiguration(),
  ],
};
