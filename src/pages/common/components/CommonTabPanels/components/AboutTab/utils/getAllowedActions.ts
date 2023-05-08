import { GovernanceActions } from "@/shared/constants";
import { CirclesPermissions, CommonMember } from "@/shared/models";
import { AboutAction } from "../constants";

export const getAllowedActions = (
  commonMember?: (CommonMember & CirclesPermissions) | null,
): AboutAction[] => {
  const allowedActions: AboutAction[] = commonMember?.allowedActions[
    GovernanceActions.UPDATE_COMMON
  ]
    ? [AboutAction.Edit]
    : [];

  if (commonMember) {
    allowedActions.push(AboutAction.InviteFriends);
  }

  return allowedActions;
};
