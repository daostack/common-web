import { GovernanceActions } from "@/shared/constants";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { NewCollaborationMenuItem } from "../../../../../../../constants";

export interface GetAllowedItemsOptions {
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  NewCollaborationMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [NewCollaborationMenuItem.NewProposal]: ({ commonMember, governance }) =>
    Boolean(
      commonMember &&
        hasPermission({
          commonMember,
          governance,
          key: GovernanceActions.CREATE_PROPOSAL,
        }),
    ),
  [NewCollaborationMenuItem.NewDiscussion]: ({ commonMember, governance }) =>
    Boolean(
      commonMember &&
        hasPermission({
          commonMember,
          governance,
          key: GovernanceActions.CREATE_DISCUSSION,
        }),
    ),
  [NewCollaborationMenuItem.NewContribution]: ({ commonMember, governance }) =>
    Boolean(
      commonMember &&
        hasPermission({
          commonMember,
          governance,
          key: GovernanceActions.CONTRIBUTE,
        }),
    ),
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): NewCollaborationMenuItem[] => {
  const orderedItems = [
    NewCollaborationMenuItem.NewProposal,
    NewCollaborationMenuItem.NewDiscussion,
    NewCollaborationMenuItem.NewContribution,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
