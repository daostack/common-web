import { Common, FeedItemFollowWithMetadata } from "@/shared/models";
import { checkIsProject } from "@/shared/utils";

type Return =
  | (Pick<Common, "id" | "name" | "image" | "listVisibility"> & {
      isProject: boolean;
    })
  | null;

export const getItemCommonData = (
  feedItemFollowWithMetadata?: FeedItemFollowWithMetadata,
  common?: Common | null,
): Return => {
  if (feedItemFollowWithMetadata) {
    return {
      id: feedItemFollowWithMetadata.commonId,
      name: feedItemFollowWithMetadata.commonName,
      image: feedItemFollowWithMetadata.commonAvatar,
      isProject: Boolean(feedItemFollowWithMetadata.parentCommonName),
      listVisibility: feedItemFollowWithMetadata.listVisibility,
    };
  }
  if (!common) {
    return null;
  }

  return {
    id: common.id,
    name: common.name,
    image: common.image,
    isProject: checkIsProject(common),
    listVisibility: common.listVisibility,
  };
};
