import { createContext, useContext } from "react";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { ProposalsTypes } from "@/shared/constants";
import {
  Circle,
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
  SupportersData,
} from "@/shared/models";
import { CommonMenuItem } from "../../constants";
import { CommonPageSettings } from "../../types";

interface Data {
  settings: CommonPageSettings;
  onMenuItemSelect: (menuItem: CommonMenuItem | null) => void;
  onProjectCreate: () => void;
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  rootCommon: Common | null;
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
