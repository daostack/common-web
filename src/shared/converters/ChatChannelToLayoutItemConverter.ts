import { InboxItemType } from "@/shared/constants";
import { ChatChannelLayoutItem } from "@/shared/interfaces";
import { ChatChannel } from "@/shared/models";
import { Converter } from "./Converter";

class ChatChannelToLayoutItemConverter extends Converter<
  ChatChannel,
  ChatChannelLayoutItem
> {
  public toTargetEntity = (
    chatChannel: ChatChannel,
  ): ChatChannelLayoutItem => ({
    type: InboxItemType.ChatChannel,
    itemId: chatChannel.id,
    chatChannel,
  });

  public toBaseEntity = (
    chatChannelLayoutItem: ChatChannelLayoutItem,
  ): ChatChannel => chatChannelLayoutItem.chatChannel;
}

export default new ChatChannelToLayoutItemConverter();
