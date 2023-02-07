import { GovernanceActions, CommonAction } from "@/shared/constants";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { hasPermission } from "@/shared/utils";

export interface GetAllowedItemsOptions {
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
}

type NewCollaborationMenuItems =
  | CommonAction.NewProposal
  | CommonAction.NewDiscussion
  | CommonAction.NewContribution;

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  NewCollaborationMenuItems,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [CommonAction.NewProposal]:  ({ commonMember, governance }) => Boolean(
    commonMember &&
      hasPermission({
        commonMember,
        governance,
        key: GovernanceActions.CREATE_PROPOSAL,
      }),
  ),
  [CommonAction.NewDiscussion]: ({ commonMember, governance }) =>
    Boolean(
      commonMember &&
        hasPermission({
          commonMember,
          governance,
          key: GovernanceActions.CREATE_DISCUSSION,
        }),
    ),
  [CommonAction.NewContribution]: () => false,
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): CommonAction[] => {
  const orderedItems: NewCollaborationMenuItems[] = [
    CommonAction.NewProposal,
    CommonAction.NewDiscussion,
    CommonAction.NewContribution,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
