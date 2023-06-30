import { CommonFeedPage } from "@/pages/commonFeed";
import { ROUTE_PATHS } from "@/shared/constants";
import { MultipleSpacesLayout } from "@/shared/layouts";
import { LayoutConfiguration } from "../types";

export const MULTIPLE_SPACES_LAYOUT_CONFIGURATION: LayoutConfiguration = {
  component: MultipleSpacesLayout,
  routes: [
    {
      path: ROUTE_PATHS.COMMON,
      exact: true,
      component: CommonFeedPage,
    },
  ],
};
