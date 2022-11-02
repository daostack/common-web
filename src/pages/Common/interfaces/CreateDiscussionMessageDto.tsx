interface InfoItem {
  value: string;
}

export interface CreateDiscussionMessageDto {
  text: string;
  ownerId: string;
  commonId: string;
  discussionId: string;
  images?: InfoItem[];
  parentId?: string;
  tags?: InfoItem[];
}
