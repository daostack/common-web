import { ContextMenuItem as Item } from "@/shared/interfaces";
import { ChatChannelUserStatus } from "@/shared/models";
import { ChatChannelMenuItem } from "../constants";

export interface Options {
  chatChannelUserStatus: ChatChannelUserStatus | null;
}

const MENU_ITEM_TO_CHECK_FUNCTION_MAP: Record<
  ChatChannelMenuItem,
  (options: Options) => boolean
> = {
  [ChatChannelMenuItem.MarkUnread]: ({ chatChannelUserStatus }) =>
    Boolean(chatChannelUserStatus?.seen),
  [ChatChannelMenuItem.MarkRead]: ({ chatChannelUserStatus }) =>
    Boolean(chatChannelUserStatus && !chatChannelUserStatus.seen),
};

export const getAllowedItems = (items: Item[], options: Options): Item[] =>
  items.filter(({ id }) => MENU_ITEM_TO_CHECK_FUNCTION_MAP[id](options));
