import { GovernanceActions } from "@/shared/constants";
import { CirclesPermissions, SupportersData } from "@/shared/models";
import { WalletAction } from "../constants";

export const getAllowedActions = (
  supportersData: SupportersData | null,
  commonMember: CirclesPermissions | null,
): WalletAction[] =>
  supportersData && commonMember?.allowedActions[GovernanceActions.CONTRIBUTE]
    ? [WalletAction.NewContribution]
    : [];
