import { GovernanceActions } from "@/shared/constants";
import { hasPermission } from "@/shared/utils";
import { GetAllowedItemsOptions } from "../../FeedItem";

export const checkIsLinkToAllowed = (
  options: GetAllowedItemsOptions,
): boolean => {
  if (!options.commonMember) {
    return false;
  }

  return hasPermission({
    commonMember: options.commonMember,
    governance: {
      circles: options.governanceCircles || {},
    },
    key: GovernanceActions.LINK_FROM_HERE,
  });
};
