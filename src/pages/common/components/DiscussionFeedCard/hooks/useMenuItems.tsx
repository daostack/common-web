import React from "react";
import { useDispatch } from "react-redux";
import { animateScroll } from "react-scroll";
import { CommonFeedService } from "@/services";
import { CommonAction, FollowFeedItemAction } from "@/shared/constants";
import { useFeedItemFollow } from "@/shared/hooks/useCases";
import {
  Edit3Icon,
  Pin2Icon,
  Report2Icon,
  Share3Icon,
  FollowIcon,
  Trash2Icon,
  UnfollowIcon,
  UnpinIcon,
} from "@/shared/icons";
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
  const { discussion, commonId, feedItem } = options;
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
      icon: <Pin2Icon />,
    },
    {
      id: FeedItemMenuItem.Unpin,
      text: "Unpin",
      onClick: async () => {
        if (!commonId || !feedItem) return;
        await CommonFeedService.unpinItem(commonId, feedItem.id);
      },
      icon: <UnpinIcon />,
    },
    {
      id: FeedItemMenuItem.Share,
      text: "Share",
      onClick: share,
      icon: <Share3Icon />,
    },
    {
      id: FeedItemMenuItem.Report,
      text: "Report",
      onClick: report,
      icon: <Report2Icon />,
    },
    {
      id: FeedItemMenuItem.Edit,
      text: "Edit",
      onClick: () => {
        if (!discussion) {
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
        animateScroll.scrollToTop({ containerId: document.body, smooth: true });
      },
      icon: <Edit3Icon />,
    },
    {
      id: FeedItemMenuItem.Follow,
      text: "Follow",
      onClick: () => feedItemFollow.onFollowToggle(FollowFeedItemAction.Follow),
      icon: <FollowIcon />,
    },
    {
      id: FeedItemMenuItem.Unfollow,
      text: "Unfollow",
      onClick: () =>
        feedItemFollow.onFollowToggle(FollowFeedItemAction.Unfollow),
      icon: <UnfollowIcon />,
    },
    remove
      ? {
          id: FeedItemMenuItem.Remove,
          text: "Delete",
          onClick: remove,
          withWarning: true,
          icon: <Trash2Icon />,
        }
      : undefined,
  ].filter(notEmpty);

  return items.filter((item) =>
    allowedMenuItems.includes(item.id as FeedItemMenuItem),
  );
};
