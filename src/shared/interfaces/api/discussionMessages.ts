export interface InfoItem {
  value: string;
}

export interface CreateDiscussionMessageDto {
  pendingMessageId?: string;
  text: string;
  ownerId: string;
  commonId: string;
  discussionId: string;
  images?: InfoItem[];
  files?: InfoItem[];
  parentId?: string;
  tags?: InfoItem[];
  mentions?: string[];
}
