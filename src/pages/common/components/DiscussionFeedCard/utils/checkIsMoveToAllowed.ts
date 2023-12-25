import { GovernanceActions } from "@/shared/constants";
import { hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions } from "../../FeedItem";

export const checkIsMoveToAllowed = (
  options: GetAllowedItemsOptions,
): boolean => {
  if (!options.commonMember) {
    return false;
  }

  const linkedCommonIds = options.discussion?.linkedCommonIds || [];

  return (
    linkedCommonIds.length === 0 &&
    hasPermission({
      commonMember: options.commonMember,
      governance: {
        circles: options.governanceCircles || {},
      },
      key: GovernanceActions.MOVE_FROM_HERE,
    })
  );
};
