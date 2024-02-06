import { DiscussionService, ProposalService } from "@/services";
import { CommonFeedType } from "@/shared/models";

interface FeedItemDisplayingData {
  title: string;
  isDeleted: boolean;
  isMoved?: boolean;
}

export const getFeedItemDisplayingData = async (
  feedItemDataId: string,
  feedItemType: CommonFeedType,
  currentCommonId?: string,
): Promise<FeedItemDisplayingData> => {
  if (feedItemType === CommonFeedType.Discussion) {
    const discussion = await DiscussionService.getDiscussionById(
      feedItemDataId,
    );
    return {
      title: discussion?.title || "",
      isDeleted: discussion?.isDeleted ?? true,
      isMoved: discussion?.commonId !== currentCommonId,
    };
  }
  if (feedItemType === CommonFeedType.Proposal) {
    const proposal = await ProposalService.getProposalById(feedItemDataId);
    return {
      title: proposal?.data.args.title || "",
      isDeleted: proposal?.isDeleted ?? true,
    };
  }

  return {
    title: "",
    isDeleted: false,
  };
};

export const getFeedItemDisplayingTitle = (
  data: FeedItemDisplayingData,
): string =>
  data.title &&
  `${data.title}${
    data.isDeleted ? " (deleted)" : data.isMoved ? " (moved)" : ""
  }`;
