import React from "react";
import { CommonFollowState } from "@/shared/hooks/useCases";
import {
  FollowIcon,
  Message3Icon,
  SearchIcon,
  Share3Icon,
  UnfollowIcon,
} from "@/shared/icons";
import { MenuItem as Item } from "@/shared/interfaces";
import { CommonFeedMenuItem } from "../../../../../constants";
import {
  Options as GetAllowedItemsOptions,
  getAllowedItems,
} from "../../../../../utils";

interface Actions {
  share: () => void;
  onSearchClick?: () => void;
  onFollowToggle: CommonFollowState["onFollowToggle"];
  markCommonAsSeen: (commonId: string) => void;
}

export const useMenuItems = (
  options: GetAllowedItemsOptions,
  actions: Actions,
): Item[] => {
  const { common, shareText } = options;
  const { share, onFollowToggle, onSearchClick, markCommonAsSeen } = actions;

  const items: Item[] = [
    {
      id: CommonFeedMenuItem.Search,
      text: "Search",
      onClick: () => onSearchClick?.(),
      icon: <SearchIcon />,
    },
    {
      id: CommonFeedMenuItem.Share,
      text: shareText ?? "Share",
      onClick: share,
      icon: <Share3Icon />,
    },
    {
      id: CommonFeedMenuItem.Follow,
      text: `Follow ${common.name}`,
      onClick: () => onFollowToggle(),
      icon: <FollowIcon />,
    },
    {
      id: CommonFeedMenuItem.Mute,
      text: `Unfollow ${common.name}`,
      onClick: () => onFollowToggle(),
      icon: <UnfollowIcon />,
    },
    {
      id: CommonFeedMenuItem.MarkRead,
      text: "Mark all as read",
      onClick: () => {
        if (!common.id) {
          return;
        }

        markCommonAsSeen(common.id);
      },
      icon: <Message3Icon />,
    },
  ];

  return getAllowedItems(items, options);
};
