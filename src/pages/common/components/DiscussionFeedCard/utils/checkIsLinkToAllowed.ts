import { GovernanceActions } from "@/shared/constants";
import { getCirclesWithLowestTier, hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions } from "../../FeedItem";

export const checkIsLinkToAllowed = (
  options: GetAllowedItemsOptions,
): boolean => {
  if (!options.commonMember) {
    return false;
  }

  const circlesWithLowestTier = getCirclesWithLowestTier(
    Object.values(options.governanceCircles || {}),
  );
  const discussionCircleVisibility =
    options.discussion?.circleVisibilityByCommon?.[options.commonId || ""] ||
    [];

  return (
    (discussionCircleVisibility.length === 0 ||
      discussionCircleVisibility.some((circleId) =>
        circlesWithLowestTier.some((circle) => circle.id === circleId),
      )) &&
    hasPermission({
      commonMember: options.commonMember,
      governance: {
        circles: options.governanceCircles || {},
      },
      key: GovernanceActions.LINK_FROM_HERE,
    })
  );
};
