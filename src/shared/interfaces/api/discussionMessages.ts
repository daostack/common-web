export interface InfoItem {
  value: string;
}

export interface CreateDiscussionMessageDto {
  id?: string;
  pendingMessageId?: string;
  text?: string;
  ownerId: string;
  commonId: string;
  discussionId: string;
  images?: InfoItem[];
  files?: InfoItem[];
  parentId?: string;
  tags?: InfoItem[];
  mentions?: string[];
  hasUncheckedItems: boolean;
}

export interface CreateDiscussionMessageReaction {
  emoji: string;
  discussionMessageId: string;
}

export interface DeleteDiscussionMessageReaction
  extends Omit<CreateDiscussionMessageReaction, "emoji"> {}
