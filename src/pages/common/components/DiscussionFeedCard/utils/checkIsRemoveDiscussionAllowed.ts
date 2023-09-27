import { GovernanceActions } from "@/shared/constants";
import { PredefinedTypes } from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions } from "../../FeedItem";

export function checkIsRemoveDiscussionAllowed(
  options: GetAllowedItemsOptions,
): boolean {
  if (
    !options.commonMember ||
    options.discussion?.predefinedType === PredefinedTypes.General
  ) {
    return false;
  }

  const circles = options.governanceCircles || {};
  const isDiscussionOwner =
    options.commonMember.userId === options.discussion?.ownerId;
  const hasPermissionToRemoveDiscussion =
    hasPermission({
      commonMember: options.commonMember,
      governance: { circles },
      key: GovernanceActions.HIDE_OR_UNHIDE_DISCUSSION,
    }) || isDiscussionOwner;

  if (!options.discussion?.proposalId) {
    return hasPermissionToRemoveDiscussion;
  }

  return (
    hasPermission({
      commonMember: options.commonMember,
      governance: { circles },
      key: GovernanceActions.HIDE_OR_UNHIDE_PROPOSAL,
    }) || isDiscussionOwner
  );
}
