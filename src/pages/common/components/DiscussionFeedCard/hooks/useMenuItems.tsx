import React from "react";
import { useDispatch } from "react-redux";
import { animateScroll } from "react-scroll";
import { CommonFeedService } from "@/services";
import { CommonAction, FollowFeedItemAction } from "@/shared/constants";
import {
  Edit3Icon,
  Pin2Icon,
  Report2Icon,
  Share3Icon,
  FollowIcon,
  Trash2Icon,
  UnfollowIcon,
  UnpinIcon,
  Link4Icon as LinkIcon,
  Message3Icon,
  MoveItemIcon,
} from "@/shared/icons";
import { ContextMenuItem as Item, UploadFile } from "@/shared/interfaces";
import { parseStringToTextEditorValue } from "@/shared/ui-kit";
import { notEmpty } from "@/shared/utils/notEmpty";
import { commonActions } from "@/store/states";
import { FeedItemMenuItem, GetAllowedItemsOptions } from "../../FeedItem";
import { getAllowedItems } from "../utils";

interface Actions {
  report: () => void;
  share: () => void;
  remove?: () => void;
  linkStream?: () => void;
  moveStream?: () => void;
}

export const useMenuItems = (
  options: GetAllowedItemsOptions,
  actions: Actions,
): Item[] => {
  const dispatch = useDispatch();
  const {
    discussion,
    commonId,
    feedItem,
    feedItemFollow,
    feedItemUserMetadata,
  } = options;
  const { report, share, remove, linkStream, moveStream } = actions;
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
      id: FeedItemMenuItem.MarkUnread,
      text: "Mark as unread",
      onClick: async () => {
        if (!commonId || !feedItem) {
          return;
        }

        await CommonFeedService.markCommonFeedItemAsUnseen(
          commonId,
          feedItem.id,
        );
      },
      icon: <Message3Icon />,
    },
    {
      id: FeedItemMenuItem.MarkRead,
      text: "Mark as read",
      onClick: async () => {
        if (!commonId || !feedItem) {
          return;
        }

        await CommonFeedService.markCommonFeedItemAsSeen({
          commonId,
          feedObjectId: feedItem.id,
          lastSeenId: feedItemUserMetadata?.lastSeen?.id,
          type: feedItemUserMetadata?.lastSeen?.type,
        });
      },
      icon: <Message3Icon />,
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
    linkStream
      ? {
          id: FeedItemMenuItem.LinkTo,
          text: "Link to...",
          onClick: linkStream,
          icon: <LinkIcon />,
        }
      : undefined,
    moveStream
      ? {
          id: FeedItemMenuItem.MoveTo,
          text: "Move to...",
          onClick: moveStream,
          icon: <MoveItemIcon />,
        }
      : undefined,
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
