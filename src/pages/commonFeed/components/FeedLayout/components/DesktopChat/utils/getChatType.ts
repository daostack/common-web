import { ChatItem } from "@/pages/common/components/ChatComponent";
import { ChatType } from "@/shared/constants";

export const getChatType = (chatItem: ChatItem): ChatType => {
  if (chatItem.proposal) {
    return ChatType.ProposalComments;
  }
  if (chatItem.chatChannel) {
    return ChatType.ChatMessages;
  }

  return ChatType.DiscussionMessages;
};
