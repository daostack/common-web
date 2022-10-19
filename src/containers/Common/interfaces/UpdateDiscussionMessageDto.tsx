interface InfoItem {
  value: string;
}

export interface UpdateDiscussionMessageDto {
  text: string;
  ownerId: string;
  discussionMessageId: string;
  images?: InfoItem[];
  parentId?: string;
  tags?: InfoItem[];
}
