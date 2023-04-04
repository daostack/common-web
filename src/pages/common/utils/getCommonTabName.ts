import { CommonTab } from "../constants";

const COMMON_TAB_TO_NAME_MAP: Record<CommonTab, string> = {
  [CommonTab.About]: "About",
  [CommonTab.Wallet]: "Wallet",
  [CommonTab.Members]: "Members",
  [CommonTab.Governance]: "Governance",
};

export const getCommonTabName = (tab: CommonTab): string =>
  COMMON_TAB_TO_NAME_MAP[tab];
