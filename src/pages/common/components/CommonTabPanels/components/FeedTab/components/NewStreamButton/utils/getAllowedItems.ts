import {
  GovernanceActions,
  CommonAction,
  ProposalsTypes,
} from "@/shared/constants";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { hasPermission } from "@/shared/utils";

export interface GetAllowedItemsOptions {
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
}

type NewStreamMenuItems =
  | CommonAction.NewProposal
  | CommonAction.NewDiscussion
  | CommonAction.NewContribution;

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  NewStreamMenuItems,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [CommonAction.NewProposal]: ({ commonMember, governance }) =>
    Boolean(
      commonMember &&
        hasPermission({
          commonMember,
          governance,
          key: ProposalsTypes.SURVEY,
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
  const orderedItems: NewStreamMenuItems[] = [
    CommonAction.NewProposal,
    CommonAction.NewDiscussion,
    CommonAction.NewContribution,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
