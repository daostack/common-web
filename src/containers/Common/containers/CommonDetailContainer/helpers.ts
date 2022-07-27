import { Tabs } from "./constants";

export const getInitialTab = (
  defaultTab: string
): Tabs => {
  const isCorrectTab = Object.values(Tabs).includes(defaultTab as Tabs);

  return isCorrectTab ? (defaultTab as Tabs) : Tabs.About;
};
