import { ContextMenuItem as Item } from "@/shared/interfaces";
import { ChatChannelUserStatus } from "@/shared/models";
import { notEmpty } from "@/shared/utils";
import { ChatChannelMenuItem } from "../constants";

export interface Options {
  chatChannelUserStatus: ChatChannelUserStatus | null;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  ChatChannelMenuItem,
  (options: Options) => boolean
> = {
  [ChatChannelMenuItem.MarkUnread]: ({ chatChannelUserStatus }) => {
    const { notSeenCount, seen } = chatChannelUserStatus || {};


    return (
      notEmpty(notSeenCount) && notEmpty(seen) && notSeenCount === 0 && seen
    );
  },
  [ChatChannelMenuItem.MarkRead]: ({ chatChannelUserStatus }) => {
    const { notSeenCount, seenOnce, seen } =
      chatChannelUserStatus || {};


    return (
      Boolean(notSeenCount) ||
      (notEmpty(seen) && !seen) ||
      (notEmpty(seenOnce) && !seenOnce)
    );
  },
};

export const getAllowedItems = (items: Item[], options: Options): Item[] =>
  items.filter(({ id }) => MENU_ITEM_TO_CHECK_FUNCTION_MAP[id](options));
