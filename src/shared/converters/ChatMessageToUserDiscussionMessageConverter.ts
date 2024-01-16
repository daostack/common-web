import { DiscussionMessageOwnerType } from "@/shared/constants";
import { ChatMessage, UserDiscussionMessage } from "@/shared/models";
import { Converter } from "./Converter";

class ChatMessageToUserDiscussionMessageConverter extends Converter<
  ChatMessage,
  UserDiscussionMessage
> {
  public toTargetEntity = (
    chatMessage: ChatMessage,
  ): UserDiscussionMessage => ({
    id: chatMessage.id,
    createdAt: chatMessage.createdAt,
    updatedAt: chatMessage.updatedAt,
    discussionId: chatMessage.chatChannelId,
    commonId: "",
    ownerName: chatMessage.ownerName,
    text: chatMessage.text,
    ownerAvatar: chatMessage.ownerAvatar.value,
    images: chatMessage.images,
    files: chatMessage.files,
    tags: chatMessage.mentions.map((mention) => ({ value: mention })),
    editedAt: chatMessage.editedAt,
    ownerType: DiscussionMessageOwnerType.User,
    ownerId: chatMessage.ownerId,
    parentId: chatMessage.parentId,
    owner: chatMessage.owner,
    parentMessage: chatMessage.parentMessage || null,
    hasUncheckedItems: chatMessage.hasUncheckedItems,
  });

  public toBaseEntity = (
    discussionMessage: UserDiscussionMessage,
  ): ChatMessage => ({
    id: discussionMessage.id,
    createdAt: discussionMessage.createdAt,
    updatedAt: discussionMessage.updatedAt,
    chatChannelId: discussionMessage.discussionId,
    ownerId: discussionMessage.ownerId,
    ownerName: discussionMessage.ownerName,
    text: discussionMessage.text,
    ownerAvatar: {
      title: discussionMessage.ownerAvatar.split("/").reverse()[0] || "avatar",
      value: discussionMessage.ownerAvatar,
    },
    images: discussionMessage.images,
    files: discussionMessage.files,
    editedAt: discussionMessage.editedAt,
    mentions: discussionMessage.tags?.map((tag) => tag.value) || [],
    parentId: discussionMessage.parentId,
    owner: discussionMessage.owner,
    parentMessage: discussionMessage.parentMessage,
    hasUncheckedItems: discussionMessage.hasUncheckedItems,
  });
}

export default new ChatMessageToUserDiscussionMessageConverter();
