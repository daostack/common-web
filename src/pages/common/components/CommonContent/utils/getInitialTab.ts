import { CommonTab } from "../../../constants";

interface Data {
  defaultTab: string;
  activeTab?: CommonTab | null;
  isCommonMember: boolean;
  allowedTabs: CommonTab[];
}

export const getInitialTab = (data: Data): CommonTab => {
  const { defaultTab, activeTab, isCommonMember, allowedTabs } = data;

  if (activeTab && allowedTabs.includes(activeTab)) {
    return activeTab;
  }

  const convertedDefaultTab = defaultTab as CommonTab;
  const isAllowedDefaultTab = allowedTabs.includes(convertedDefaultTab);

  if (isAllowedDefaultTab) {
    return convertedDefaultTab;
  }

  return isCommonMember ? CommonTab.Feed : CommonTab.About;
};
