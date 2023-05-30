import { CommonFeedType, PredefinedTypes } from "@/shared/models";
import { GetAllowedItemsOptions } from "../../FeedItem";

export function checkIsEditItemAllowed(options: GetAllowedItemsOptions) {
  if (!options.commonMember) return false;
  if (options.discussion?.predefinedType === PredefinedTypes.General)
    return false;

  return (
    options.commonMember.userId === options.discussion?.ownerId &&
    options.feedItem?.data.type === CommonFeedType.Discussion
  );
}
