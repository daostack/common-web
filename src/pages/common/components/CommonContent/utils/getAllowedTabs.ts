import { CommonTab } from "../../../constants";

interface Data {
  isCommonMember: boolean;
  withFeed?: boolean;
}

const ALLOWED_NON_MEMBER_TABS = [CommonTab.About];
export const ALL_TABS = [CommonTab.About, CommonTab.Wallet, CommonTab.Members];
const ALL_TABS_WITH_FEED = [
  CommonTab.About,
  CommonTab.Feed,
  CommonTab.Wallet,
  CommonTab.Members,
];

export const getAllowedTabs = (data: Data): CommonTab[] => {
  const { isCommonMember, withFeed = false } = data;

  if (!isCommonMember) {
    return ALLOWED_NON_MEMBER_TABS;
  }

  return withFeed ? ALL_TABS_WITH_FEED : ALL_TABS;
};
