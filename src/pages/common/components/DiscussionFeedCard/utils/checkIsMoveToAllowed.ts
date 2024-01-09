import { GovernanceActions } from "@/shared/constants";
import { PredefinedTypes } from "@/shared/models";
import { hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions } from "../../FeedItem";

export const checkIsMoveToAllowed = (
  options: GetAllowedItemsOptions,
): boolean => {
  if (
    !options.commonMember ||
    options.discussion?.predefinedType === PredefinedTypes.General
  ) {
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
      action: GovernanceActions.MOVE_FROM_HERE,
    })
  );
};
