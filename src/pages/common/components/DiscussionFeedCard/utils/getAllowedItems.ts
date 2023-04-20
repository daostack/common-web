import {
  Circles,
  CommonFeed,
  CommonMember,
  Discussion,
  Proposal,
  ProposalState,
} from "@/shared/models";
import { GovernanceActions } from "../../../../../shared/constants";
import { hasPermission } from "../../../../../shared/utils";
import { DiscussionCardMenuItem } from "../constants";

export interface GetAllowedItemsOptions {
  discussion?: Discussion | null;
  governanceCircles?: Circles;
  feedItem?: CommonFeed;
  proposal?: Proposal;
  commonMember?: CommonMember | null;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  DiscussionCardMenuItem,
  (options: GetAllowedItemsOptions) => boolean
> = {
  [DiscussionCardMenuItem.Share]: () => false,
  [DiscussionCardMenuItem.Report]: () => false,
  [DiscussionCardMenuItem.Edit]: () => false,
  [DiscussionCardMenuItem.Remove]: (options) => {
    if (!options.commonMember) return false;
    let isAllowed = hasPermission({
      commonMember: options.commonMember,
      governance: {
        circles: options.governanceCircles || {},
      },
      key: GovernanceActions.HIDE_OR_UNHIDE_DISCUSSION,
    });
    if (options.discussion?.proposalId && isAllowed) {
      const { proposal } = options;
      isAllowed =
        !!proposal &&
        (proposal.state === ProposalState.DISCUSSION ||
          proposal.state === ProposalState.VOTING) &&
        hasPermission({
          commonMember: options.commonMember,
          governance: {
            circles: options.governanceCircles || {},
          },
          key: GovernanceActions.HIDE_OR_UNHIDE_PROPOSAL,
        });
    }
    return isAllowed;
  },
};

export const getAllowedItems = (
  options: GetAllowedItemsOptions,
): DiscussionCardMenuItem[] => {
  const orderedItems = [
    DiscussionCardMenuItem.Share,
    DiscussionCardMenuItem.Report,
    DiscussionCardMenuItem.Edit,
    DiscussionCardMenuItem.Remove,
  ];

  return orderedItems.filter((item) =>
    MENU_ITEM_TO_CHECK_FUNCTION_MAP[item](options),
  );
};
