import React from "react";
import { CommonFollowState } from "@/shared/hooks/useCases";
import { FollowIcon, Share3Icon, UnfollowIcon } from "@/shared/icons";
import { MenuItem as Item } from "@/shared/interfaces";
import { CommonFeedMenuItem } from "../../../../../constants";
import {
  Options as GetAllowedItemsOptions,
  getAllowedItems,
} from "../../../../../utils";

interface Actions {
  share: () => void;
  onFollowToggle: CommonFollowState["onFollowToggle"];
}

export const useMenuItems = (
  options: GetAllowedItemsOptions,
  actions: Actions,
): Item[] => {
  const { common } = options;
  const { share, onFollowToggle } = actions;

  const items: Item[] = [
    {
      id: CommonFeedMenuItem.Share,
      text: "Share",
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
  ];

  return getAllowedItems(items, options);
};
