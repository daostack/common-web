import { CommonTab } from "../../../constants";

interface Data {
  isCommonMember: boolean;
  isMobileView: boolean;
}

const ALLOWED_NON_MEMBER_TABS = [CommonTab.About, CommonTab.Governance];
const ALLOWED_MOBILE_TABS = [
  CommonTab.About,
  CommonTab.Feed,
  CommonTab.Governance,
  CommonTab.Wallet,
];
const ALL_TABS = Object.values(CommonTab);

export const getAllowedTabs = (data: Data): CommonTab[] => {
  const { isCommonMember, isMobileView } = data;

  if (!isCommonMember) {
    return ALLOWED_NON_MEMBER_TABS;
  }

  return isMobileView ? ALLOWED_MOBILE_TABS : ALL_TABS;
};
