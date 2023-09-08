import { DiscussionService, ProposalService } from "@/services";
import { CommonFeedType } from "@/shared/models";

export const getFeedItemTitleByDataIdAndType = async (
  feedItemDataId: string,
  feedItemType: CommonFeedType,
): Promise<string> => {
  if (feedItemType === CommonFeedType.Discussion) {
    const discussion = await DiscussionService.getDiscussionById(
      feedItemDataId,
    );
    return discussion?.title || "";
  }
  if (feedItemType === CommonFeedType.Proposal) {
    const discussion = await ProposalService.getProposalById(feedItemDataId);
    return discussion?.data.args.title || "";
  }

  return "";
};
