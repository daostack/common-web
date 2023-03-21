import { CommonTab } from "../../../constants";

interface Data {
  defaultTab: string;
  allowedTabs: CommonTab[];
}

export const getInitialTab = (data: Data): CommonTab => {
  const { defaultTab, allowedTabs } = data;

  const convertedDefaultTab = defaultTab as CommonTab;
  const isAllowedDefaultTab = allowedTabs.includes(convertedDefaultTab);

  if (isAllowedDefaultTab) {
    return convertedDefaultTab;
  }

  return CommonTab.About;
};
