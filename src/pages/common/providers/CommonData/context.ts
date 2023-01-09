import { createContext, useContext } from "react";
import { Circle, Common, Governance } from "@/shared/models";
import { ProposalsTypes } from "@/shared/constants";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { CommonMenuItem, NewCollaborationMenuItem } from "../../constants";

interface Data {
  onMenuItemSelect: (menuItem: CommonMenuItem | null) => void;
  areNonCreatedProjectsLeft: boolean;
  onProjectCreate: () => void;
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommon?: Common;
  parentCommonSubCommons: Common[];
  onLeaveCircle: (
    commonId: string,
    commonMemberId: string,
    circle: Circle,
  ) => void;
  onJoinCircle: (payload: Omit<CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"], "type">, circleName: string) => void;
  newCollaborationMenuItem: NewCollaborationMenuItem | null;
  onNewCollaborationMenuItemSelect: (
    menuItem: NewCollaborationMenuItem | null,
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
