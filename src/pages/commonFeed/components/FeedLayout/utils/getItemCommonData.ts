import { Common, FeedItemFollowWithMetadata } from "@/shared/models";
import { checkIsProject } from "@/shared/utils";

type Return =
  | (Pick<Common, "id" | "name" | "image" | "description" | "gallery"> & {
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
      description: feedItemFollowWithMetadata.commonDescription ?? "", 
      gallery: feedItemFollowWithMetadata.commonGallery ?? [],
      image: feedItemFollowWithMetadata.commonAvatar,
      isProject: Boolean(feedItemFollowWithMetadata.parentCommonName),
    };
  }
  if (!common) {
    return null;
  }

  return {
    id: common.id,
    name: common.name,
    image: common.image,
    description: common.description,
    gallery: common.gallery,
    isProject: checkIsProject(common),
  };
};
