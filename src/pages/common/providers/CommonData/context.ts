import { createContext, useContext } from "react";
import { CommonMenuItem } from "../../constants";

interface Data {
  onMenuItemSelect: (menuItem: CommonMenuItem | null) => void;
  onProjectCreate: () => void;
}

export type CommonDataContextValue = Data | null;

export const CommonDataContext = createContext<CommonDataContextValue>(null);

export const useCommonDataContext = (): Data => {
  const context = useContext(CommonDataContext);

  if (context === null) {
    throw new Error(
      "Common components must be wrapped in <CommonDataProvider />",
    );
  }

  return context;
};
