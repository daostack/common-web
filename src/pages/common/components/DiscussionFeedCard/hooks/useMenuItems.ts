import AlertConfirm from "react-alert-confirm";
import { useDispatch } from "react-redux";
import { DiscussionService } from "@/services";
import { CommonAction } from "@/shared/constants";
import { ContextMenuItem as Item } from "@/shared/interfaces";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { asyncConfirm } from "@/shared/utils/asyncConfirm";
import { commonActions } from "@/store/states";
import { CommonFeedType } from "../../../../../shared/models";
import { DiscussionCardMenuItem } from "../constants";
import { DELETE_CONFIRM_OPTIONS } from "../constants/confirms";
import { getAllowedItems, GetAllowedItemsOptions } from "../utils";

type Options = GetAllowedItemsOptions;

interface Actions {
  report: () => void;
  share: () => void;
}

const FeedTypesToRemove = [CommonFeedType.Proposal, CommonFeedType.Discussion];

export const useMenuItems = (options: Options, actions: Actions): Item[] => {
  const dispatch = useDispatch();
  const { discussion, governanceCircles, feedItem } = options;
  const { report, share } = actions;
  const allowedMenuItems = getAllowedItems(options);
  const items: Item[] = [
    {
      id: DiscussionCardMenuItem.Share,
      text: "Share",
      onClick: share,
    },
    {
      id: DiscussionCardMenuItem.Report,
      text: "Report",
      onClick: report,
    },
    {
      id: DiscussionCardMenuItem.Edit,
      text: "Edit",
      onClick: () => {
        if (!discussion || !governanceCircles) {
          return;
        }

        const circles = Object.values(governanceCircles).filter((circle) =>
          discussion.circleVisibility?.includes(circle.id),
        );
        const circle = null;

        dispatch(
          commonActions.setDiscussionCreationData({
            circle: null,
            title: discussion.title,
            content: parseStringToTextEditorValue(discussion.message),
            images: [],
          }),
        );
        dispatch(commonActions.setCommonAction(CommonAction.EditDiscussion));
      },
    },
    {
      id: DiscussionCardMenuItem.Remove,
      text: "Remove",
      onClick: async () => {
        if (!feedItem || !discussion) return;
        // If the feed type is not a proposal or discussion, treat it as discussion
        let feedType = feedItem.data.type;
        if (!FeedTypesToRemove.includes(feedType)) {
          feedType = CommonFeedType.Discussion;
        }
        await asyncConfirm({
          ...DELETE_CONFIRM_OPTIONS,
          title: `Are you sure you want to delete this ${feedType.toLowerCase()}?`,
          onConfirm: () => DiscussionService.deleteDiscussion(discussion.id),
        });
      },
    },
  ];

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as DiscussionCardMenuItem),
  );
};
