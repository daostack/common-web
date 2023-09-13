import { ChatChannel, Discussion, Timestamp } from "@/shared/models";
import { Converter } from "./Converter";

class ChatChannelToDiscussionConverter extends Converter<
  ChatChannel,
  Discussion
> {
  public toTargetEntity = (chatChannel: ChatChannel): Discussion => ({
    id: chatChannel.id,
    title: chatChannel.name,
    message: chatChannel.description,
    ownerId: chatChannel.createdBy,
    commonId: "",
    lastMessage: chatChannel.lastMessage?.createdAt || Timestamp.now(),
    files: [],
    images: [],
    followers: [],
    messageCount: chatChannel.messageCount,
    discussionMessages: [],
    isDeleted: false,
    createdAt: chatChannel.createdAt,
    updatedAt: chatChannel.updatedAt,
  });

  public toBaseEntity = (discussion: Discussion): ChatChannel => ({
    id: discussion.id,
    name: discussion.title,
    description: discussion.message,
    participants: [],
    createdBy: discussion.ownerId,
    messageCount: discussion.messageCount,
    createdAt: discussion.createdAt,
    updatedAt: discussion.updatedAt,
  });
}

export default new ChatChannelToDiscussionConverter();
