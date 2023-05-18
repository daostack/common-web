import { ProposalsTypes } from "@/shared/constants";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { CommonMenuItem } from "../../../constants";

export interface GetAllowedItemsOptions {
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
  isSubCommon: boolean;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  CommonMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [CommonMenuItem.Governance]: () => true,
  [CommonMenuItem.LeaveCommon]: ({ commonMember, isSubCommon }) =>
    Boolean(commonMember && !isSubCommon),
  [CommonMenuItem.LeaveProject]: ({ commonMember, isSubCommon }) =>
    Boolean(commonMember && isSubCommon),
  [CommonMenuItem.DeleteCommon]: ({ commonMember, governance }) =>
    Boolean(
      commonMember &&
        hasPermission({
          commonMember,
          governance,
          key: ProposalsTypes.DELETE_COMMON,
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
    CommonMenuItem.DeleteCommon,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
