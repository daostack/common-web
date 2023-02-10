import { CommonTab } from "../../../constants";

interface Data {
  defaultTab: string;
  isCommonMember: boolean;
  allowedTabs: CommonTab[];
}

export const getInitialTab = (data: Data): CommonTab => {
  const { defaultTab, isCommonMember, allowedTabs } = data;

  const convertedDefaultTab = defaultTab as CommonTab;
  const isAllowedDefaultTab = allowedTabs.includes(convertedDefaultTab);

  if (isAllowedDefaultTab) {
    return convertedDefaultTab;
  }

  return isCommonMember ? CommonTab.Feed : CommonTab.About;
};
