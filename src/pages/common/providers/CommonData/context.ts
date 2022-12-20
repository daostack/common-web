import { createContext, useContext } from "react";
import { CommonMenuItem } from "../../constants";
import { Common } from "@/shared/models";

interface Data {
  onMenuItemSelect: (menuItem: CommonMenuItem | null) => void;
  areNonCreatedProjectsLeft: boolean;
  onProjectCreate: () => void;
  subCommons: Common[];
  parentCommon?: Common;
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
