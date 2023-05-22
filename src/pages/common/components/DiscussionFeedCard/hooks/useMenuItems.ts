import { useDispatch } from "react-redux";
import { CommonFeedService } from "@/services";
import { CommonAction, FollowFeedItemAction } from "@/shared/constants";
import { useFeedItemFollow } from "@/shared/hooks/useCases";
import { ContextMenuItem as Item, UploadFile } from "@/shared/interfaces";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { notEmpty } from "@/shared/utils/notEmpty";
import { commonActions } from "@/store/states";
import { FeedItemMenuItem, GetAllowedItemsOptions } from "../../FeedItem";
import { getAllowedItems } from "../utils";

export type MenuItemOptions = Omit<GetAllowedItemsOptions, "feedItemFollow">;

interface Actions {
  report: () => void;
  share: () => void;
  remove?: () => void;
}

export const useMenuItems = (
  options: MenuItemOptions,
  actions: Actions,
): Item[] => {
  const dispatch = useDispatch();
  const { discussion, governanceCircles, commonId, feedItem } = options;
  const { report, share, remove } = actions;
  const feedItemFollow = useFeedItemFollow(
    options.feedItem?.id,
    options.commonId,
  );
  const allowedMenuItems = getAllowedItems({ ...options, feedItemFollow });
  const items: Item[] = [
    {
      id: FeedItemMenuItem.Pin,
      text: "Pin",
      onClick: async () => {
        if (!commonId || !feedItem) return;
        await CommonFeedService.pinItem(commonId, feedItem.id);
      },
    },
    {
      id: FeedItemMenuItem.Unpin,
      text: "Unpin",
      onClick: async () => {
        if (!commonId || !feedItem) return;
        await CommonFeedService.unpinItem(commonId, feedItem.id);
      },
    },
    {
      id: FeedItemMenuItem.Share,
      text: "Share",
      onClick: share,
    },
    {
      id: FeedItemMenuItem.Report,
      text: "Report",
      onClick: report,
    },
    {
      id: FeedItemMenuItem.Edit,
      text: "Edit",
      onClick: () => {
        if (!discussion || !governanceCircles) {
          return;
        }

        const files: UploadFile[] = discussion.images.map((file, index) => ({
          id: index.toString(),
          title: file.title,
          file: file.value,
        }));

        dispatch(
          commonActions.setDiscussionCreationData({
            circle: null,
            title: discussion.title,
            content: parseStringToTextEditorValue(discussion.message),
            images: files,
            id: discussion.id,
          }),
        );
        dispatch(commonActions.setCommonAction(CommonAction.EditDiscussion));
      },
    },
    {
      id: FeedItemMenuItem.Follow,
      text: "Follow",
      onClick: () => feedItemFollow.onFollowToggle(FollowFeedItemAction.Follow),
    },
    {
      id: FeedItemMenuItem.Unfollow,
      text: "Unfollow",
      onClick: () =>
        feedItemFollow.onFollowToggle(FollowFeedItemAction.Unfollow),
    },
    remove
      ? {
          id: FeedItemMenuItem.Remove,
          text: "Remove",
          onClick: remove,
        }
      : undefined,
  ].filter(notEmpty);

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as FeedItemMenuItem),
  );
};
