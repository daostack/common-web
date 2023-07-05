import { FeedLayoutItemChangeData } from "@/shared/interfaces";
import { ChatChannel } from "@/shared/models";

export interface ChatChannelFeedLayoutItemProps {
  chatChannel: ChatChannel;
  isActive?: boolean;
  onActiveItemDataChange?: (data: FeedLayoutItemChangeData) => void;
}
