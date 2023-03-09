import { createContext, useContext } from "react";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { ProposalsTypes } from "@/shared/constants";
import { Circle, Common, Governance, SupportersData } from "@/shared/models";
import { CommonMenuItem } from "../../constants";

interface Data {
  onMenuItemSelect: (menuItem: CommonMenuItem | null) => void;
  onProjectCreate: () => void;
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommon?: Common;
  parentCommonSubCommons: Common[];
  supportersData: SupportersData | null;
  isJoinAllowed: boolean;
  isJoinPending: boolean;
  onJoinCommon?: () => void;
  onLeaveCircle: (
    commonId: string,
    commonMemberId: string,
    circle: Circle,
  ) => void;
  onJoinCircle: (
    payload: Omit<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"], "type">,
    circleName: string,
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
