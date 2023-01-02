import { createContext, useContext } from "react";
import { Circle, Common } from "@/shared/models";
import { CommonMenuItem } from "../../constants";

interface Data {
  onMenuItemSelect: (menuItem: CommonMenuItem | null) => void;
  areNonCreatedProjectsLeft: boolean;
  onProjectCreate: () => void;
  subCommons: Common[];
  parentCommon?: Common;
  parentCommonSubCommons: Common[];
  onLeaveCircle: (
    commonId: string,
    commonMemberId: string,
    circle: Circle,
  ) => void;
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
