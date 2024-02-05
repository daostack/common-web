import React from "react";
import { ChatService } from "@/services";
import { Message3Icon } from "@/shared/icons";
import { ContextMenuItem as Item } from "@/shared/interfaces";
import { ChatChannelMenuItem } from "../constants";
import { getAllowedItems, Options as GetAllowedItemsOptions } from "../utils";

export const useMenuItems = (options: GetAllowedItemsOptions): Item[] => {
  const { chatChannelUserStatus } = options;
  const items: Item[] = [
    {
      id: ChatChannelMenuItem.MarkUnread,
      text: "Mark as unread",
      onClick: async () => {
        if (!chatChannelUserStatus) {
          return;
        }

        await ChatService.markChatChannelAsUnseen(
          chatChannelUserStatus.chatChannelId,
        );
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

        await ChatService.markChatChannelAsSeen(
          chatChannelUserStatus.chatChannelId,
        );
      },
      icon: <Message3Icon />,
    },
  ];

  return getAllowedItems(items, options);
};
