import { GovernanceActions } from "@/shared/constants";
import { PredefinedTypes } from "@/shared/models";
import { checkIsCountdownState, hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions } from "./shared";

export function isRemoveDiscussionAllowed(options: GetAllowedItemsOptions) {
  if (!options.commonMember) return false;
  if (options.discussion?.predefinedType === PredefinedTypes.General)
    return false;

  const hasPermissionToRemoveDiscussion =
    hasPermission({
      commonMember: options.commonMember,
      governance: {
        circles: options.governanceCircles || {},
      },
      key: GovernanceActions.HIDE_OR_UNHIDE_DISCUSSION,
    }) || options.commonMember.userId === options.discussion?.ownerId;

  let isAllowed = hasPermissionToRemoveDiscussion;
  if (options.discussion?.proposalId && isAllowed) {
    const { proposal } = options;
    const hasPermissionToRemoveProposal =
      hasPermission({
        commonMember: options.commonMember,
        governance: {
          circles: options.governanceCircles || {},
        },
        key: GovernanceActions.HIDE_OR_UNHIDE_PROPOSAL,
      }) || options.commonMember.userId === options.discussion?.ownerId;
    isAllowed =
      !!proposal &&
      checkIsCountdownState({ state: proposal.state }) &&
      hasPermissionToRemoveProposal;
  }
  return isAllowed;
}
