import { DiscussionService, ProposalService } from "@/services";
import { CommonFeedType } from "@/shared/models";

export const getFeedItemDisplayingData = async (
  feedItemDataId: string,
  feedItemType: CommonFeedType,
): Promise<{
  title: string;
  isDeleted: boolean;
}> => {
  if (feedItemType === CommonFeedType.Discussion) {
    const discussion = await DiscussionService.getDiscussionById(
      feedItemDataId,
    );
    return {
      title: discussion?.title || "",
      isDeleted: discussion?.isDeleted ?? true,
    };
  }
  if (feedItemType === CommonFeedType.Proposal) {
    const proposal = await ProposalService.getProposalById(feedItemDataId);
    return {
      title: proposal?.data.args.title || "",
      isDeleted: false,
    };
  }

  return {
    title: "",
    isDeleted: false,
  };
};
