import { GovernanceActions } from "@/shared/constants";
import { CirclesPermissions } from "@/shared/models";
import { WalletAction } from "../constants";

export const getAllowedActions = (
  commonMember?: CirclesPermissions | null,
): WalletAction[] =>
  commonMember?.allowedActions[GovernanceActions.CONTRIBUTE]
    ? [WalletAction.NewContribution]
    : [];
