import { CommonTab } from "../../../constants";

interface Data {
  isCommonMember: boolean;
  isMobileView: boolean;
}

const ALLOWED_NON_MEMBER_TABS = [CommonTab.About];
export const ALL_TABS = [CommonTab.About, CommonTab.Wallet, CommonTab.Members];
const ALLOWED_MOBILE_TABS = [...ALL_TABS];

export const getAllowedTabs = (data: Data): CommonTab[] => {
  const { isCommonMember, isMobileView } = data;

  if (!isCommonMember) {
    return ALLOWED_NON_MEMBER_TABS;
  }

  return isMobileView ? ALLOWED_MOBILE_TABS : ALL_TABS;
};
