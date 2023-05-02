import { GovernanceActions } from "@/shared/constants";
import { checkIsCountdownState, hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions } from "./shared";

export function isRemoveDiscussionAllowed(options: GetAllowedItemsOptions) {
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
      checkIsCountdownState({ state: proposal.state }) &&
      hasPermission({
        commonMember: options.commonMember,
        governance: {
          circles: options.governanceCircles || {},
        },
        key: GovernanceActions.HIDE_OR_UNHIDE_PROPOSAL,
      });
  }
  return isAllowed;
}
