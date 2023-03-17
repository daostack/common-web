import { LayoutTab } from "../../../constants";

const LAYOUT_TAB_TO_NAME_MAP: Record<LayoutTab, string> = {
  [LayoutTab.Spaces]: "Spaces",
  [LayoutTab.Inbox]: "Inbox",
  [LayoutTab.Profile]: "Profile",
};

export const getLayoutTabName = (tab: LayoutTab): string =>
  LAYOUT_TAB_TO_NAME_MAP[tab];
