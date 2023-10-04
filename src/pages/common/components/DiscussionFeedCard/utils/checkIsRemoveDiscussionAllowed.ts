import { GovernanceActions } from "@/shared/constants";
import { PredefinedTypes } from "@/shared/models";
import { getCirclesWithHighestTier, hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions } from "../../FeedItem";

export function checkIsRemoveDiscussionAllowed(
  options: GetAllowedItemsOptions,
): boolean {
  const { commonMember } = options;

  if (
    !commonMember ||
    options.discussion?.predefinedType === PredefinedTypes.General
  ) {
    return false;
  }

  const circles = options.governanceCircles || {};
  const isDiscussionOwner = commonMember.userId === options.discussion?.ownerId;
  const hasPermissionToRemoveDiscussion =
    hasPermission({
      commonMember,
      governance: { circles },
      key: GovernanceActions.HIDE_OR_UNHIDE_DISCUSSION,
    }) || isDiscussionOwner;

  if (!options.discussion?.proposalId) {
    return hasPermissionToRemoveDiscussion;
  }

  const circlesWithHighestTier = getCirclesWithHighestTier(
    Object.values(circles),
  );

  return circlesWithHighestTier.some((circle) =>
    commonMember.circleIds.includes(circle.id),
  );
}
