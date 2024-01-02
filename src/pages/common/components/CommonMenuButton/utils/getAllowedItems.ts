import { GovernanceActions, ProposalsTypes } from "@/shared/constants";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { CommonMenuItem } from "../../../constants";

export interface GetAllowedItemsOptions {
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
  isSubCommon: boolean;
  canLeaveSpace: boolean;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  CommonMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [CommonMenuItem.Governance]: () => true,
  [CommonMenuItem.LeaveCommon]: ({ commonMember, isSubCommon }) =>
    Boolean(commonMember && !isSubCommon),
  [CommonMenuItem.LeaveProject]: ({
    commonMember,
    isSubCommon,
    canLeaveSpace,
  }) => Boolean(commonMember && isSubCommon && canLeaveSpace),
  [CommonMenuItem.DeleteCommonProposal]: ({ commonMember, governance }) =>
    Boolean(
      commonMember &&
        hasPermission({
          commonMember,
          governance,
          proposal: ProposalsTypes.DELETE_COMMON,
        }),
    ),
  [CommonMenuItem.DeleteCommonAction]: ({ commonMember, governance }) =>
    Boolean(
      commonMember &&
        hasPermission({
          commonMember,
          governance,
          action: GovernanceActions.DELETE_COMMON,
        }),
    ),
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): CommonMenuItem[] => {
  const orderedItems = [
    CommonMenuItem.Governance,
    CommonMenuItem.LeaveCommon,
    CommonMenuItem.LeaveProject,
    CommonMenuItem.DeleteCommonProposal,
    CommonMenuItem.DeleteCommonAction,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
