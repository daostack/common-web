import React, { useMemo } from "react";
import { Message3Icon } from "@/shared/icons";
import { ContextMenuItem as Item } from "@/shared/interfaces";
import { ChatChannelMenuItem } from "../constants";
import { getAllowedItems, Options as GetAllowedItemsOptions } from "../utils";

interface Actions {
  markChatChannelAsSeen: (chatChannelId: string) => void;
  markChatChannelAsUnseen: (chatChannelId: string) => void;
}

export const useMenuItems = (
  options: GetAllowedItemsOptions,
  actions: Actions,
): Item[] => {
  const { chatChannelUserStatus } = options;
  const { markChatChannelAsSeen, markChatChannelAsUnseen } = actions;
  const items: Item[] = useMemo(
    () => [
      {
        id: ChatChannelMenuItem.MarkUnread,
        text: "Mark as unread",
        onClick: async () => {
          if (!chatChannelUserStatus) {
            return;
          }

          markChatChannelAsUnseen(chatChannelUserStatus.chatChannelId);
        },
        icon: <Message3Icon />,
      },
      {
        id: ChatChannelMenuItem.MarkRead,
        text: "Mark as read",
        onClick: async () => {
          if (!chatChannelUserStatus) {
            return;
          }

          markChatChannelAsSeen(chatChannelUserStatus.chatChannelId);
        },
        icon: <Message3Icon />,
      },
    ],
    [chatChannelUserStatus?.chatChannelId],
  );

  const menuItems = useMemo(() => getAllowedItems(items, options), [items, options]);

  return menuItems;
};
